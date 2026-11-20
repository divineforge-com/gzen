#!/usr/bin/env python3
"""Risk-tier labeller and T0 auto-merge for STACKy repos.

Policy: divineforge/sentinel docs/team/OWNERSHIP.md (decision rights).
Path rules: .github/risk-tiers.yml (read from the BASE branch, never the PR).

Modes:
  label  - compute the PR tier, set exactly one tier:N label (escalate-only),
           warn when a commit's author equals its Verified-by trailer,
           then try to merge if the PR is T0 and CI is green.
  sweep  - try to merge every open tier:0 PR whose CI is green.
  explain <path>... - local: print the tier and rule for each path.

Safety properties (Atlas review B1-B5):
  * Fails closed: nothing merges unless the repo variable
    AUTOMERGE_ENABLED is exactly "true" (env AUTOMERGE_ENABLED).
  * The merge decision never trusts a label. try_merge re-fetches the PR,
    recomputes the tier from the file list and commits at the head SHA it
    is about to merge, and pins the merge to that SHA.
  * Renamed files are classified by both the old and the new path.
  * Only same-repo PRs (head repo == base repo) opened by our own account
    (divineforge or dependabot[bot]) can auto-merge. Fork PRs never do.
  * A Dependabot PR drops to T0 only when every commit on the branch is
    authored by dependabot[bot] (and GitHub-verified) and every non-T0 file
    is a dependency manifest or lockfile.
"""
import json
import os
import re
import subprocess
import sys

import yaml

REPO = os.environ.get("GITHUB_REPOSITORY", "")
TIER_LABELS = {0: "tier:0", 1: "tier:1", 2: "tier:2", 3: "tier:3"}
LABEL_META = {
    "tier:0": ("0e8a16", "T0: docs/content/Dependabot patch-minor; auto-merges when CI is green"),
    "tier:1": ("fbca04", "T1: normal code; owner merges after Spark's verified label"),
    "tier:2": ("d93f0b", "T2: secrets/auth/exposure/CI/major bumps; Atlas reviews (one pass)"),
    "tier:3": ("b60205", "T3: money/ads/live trading/irreversible; Atlas + William; never auto-merges"),
    "verified": ("1d76db", "Spark verified the change with evidence"),
}
CI_WORKFLOW = os.environ.get("CI_WORKFLOW_NAME", "CI")

DEPENDABOT = "dependabot[bot]"
# Accounts whose PRs may auto-merge (compared case-insensitively).
AUTOMERGE_AUTHORS = {"divineforge", DEPENDABOT}
BLOCKING_LABELS = {"tier:1", "tier:2", "tier:3", "do-not-merge", "hold"}
# GitHub caps these listings; at or above the cap we cannot see everything.
MAX_FILES = 3000
MAX_COMMITS = 250

# Files a Dependabot patch/minor bump may touch and still drop to T0.
MANIFEST_PATTERNS = [
    "package.json", "package-lock.json", "npm-shrinkwrap.json", "pnpm-lock.yaml",
    "yarn.lock", "go.mod", "go.sum", "requirements*.txt", "Pipfile", "Pipfile.lock",
    "poetry.lock", "Cargo.toml", "Cargo.lock", "Gemfile", "Gemfile.lock",
    "composer.json", "composer.lock",
]

UPDATE_RANK = {"patch": 1, "minor": 2, "major": 3}


# --------------------------------------------------------------------------
# gh helpers
# --------------------------------------------------------------------------
def gh(*args, check=True):
    r = subprocess.run(["gh", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {r.stderr.strip()}")
    return r


def gh_json(*args):
    out = gh(*args).stdout
    return json.loads(out) if out.strip() else None


def gh_pages(path, limit):
    """Every item of a paginated list endpoint, fetched page by page.

    Stops after `limit` items; callers treat len(result) >= limit as
    "incomplete" and fail closed.
    """
    items, page = [], 1
    sep = "&" if "?" in path else "?"
    while len(items) < limit:
        chunk = gh_json("api", f"{path}{sep}per_page=100&page={page}") or []
        items.extend(chunk)
        if len(chunk) < 100:
            break
        page += 1
    return items


# --------------------------------------------------------------------------
# path rules
# --------------------------------------------------------------------------
def glob_to_re(pattern):
    i, out = 0, ""
    while i < len(pattern):
        c = pattern[i]
        if pattern.startswith("**/", i):
            out += "(?:.*/)?"
            i += 3
            continue
        if pattern.startswith("**", i):
            out += ".*"
            i += 2
            continue
        if c == "*":
            out += "[^/]*"
        elif c == "?":
            out += "[^/]"
        else:
            out += re.escape(c)
        i += 1
    return re.compile("^" + out + "$", re.IGNORECASE)


def matches(path, patterns):
    base = path.rsplit("/", 1)[-1]
    for p in patterns:
        rx = glob_to_re(p)
        if rx.match(path) or ("/" not in p and rx.match(base)):
            return p
    return None


def file_tier(path, rules):
    tiers = rules.get("tiers", {})
    for t in (3, 2):
        hit = matches(path, tiers.get(t, []) or [])
        if hit:
            return t, hit
    hit = matches(path, tiers.get(0, []) or [])
    if hit:
        return 0, hit
    return int(rules.get("default_tier", 1)), "default"


def changed_paths(files):
    """Every path a change touches, as (path, note) pairs.

    `files` items are GitHub PR-file dicts or plain path strings. A rename
    yields both the previous and the new path so that neither can hide a
    protected file (B3).
    """
    out = []
    for f in files:
        if isinstance(f, str):
            out.append((f, ""))
            continue
        out.append((f["filename"], ""))
        prev = f.get("previous_filename")
        if prev and prev != f["filename"]:
            out.append((prev, f"renamed to {f['filename']}"))
    return out


def is_manifest(path):
    return matches(path, MANIFEST_PATTERNS) is not None


# --------------------------------------------------------------------------
# Dependabot
# --------------------------------------------------------------------------
def all_commits_dependabot(commits):
    """True only if every commit is authored by dependabot[bot] and verified."""
    if not commits:
        return False
    for c in commits:
        login = ((c.get("author") or {}).get("login") or "")
        verified = ((c.get("commit") or {}).get("verification") or {}).get("verified") is True
        if login.lower() != DEPENDABOT or not verified:
            return False
    return True


def _version_parts(v):
    m = re.match(r"v?(\d+)(?:\.(\d+))?(?:\.(\d+))?", v.strip())
    if not m:
        return None
    return tuple(int(x or 0) for x in m.groups())


def _semver_level(old, new):
    """Semver level of a bump. Conservative: a 0.x minor bump counts as major."""
    a, b = _version_parts(old), _version_parts(new)
    if a is None or b is None:
        return None
    if a[0] != b[0]:
        return "major"
    if a[0] == 0 and a[1] != b[1]:
        return "major"
    if a[1] != b[1]:
        return "minor"
    return "patch"


def _commit_update_levels(msg):
    """Semver levels one Dependabot commit message declares, or None if unsure.

    Current Dependabot commits list "Updates `dep` from A to B" lines and an
    `updated-dependencies:` block that may or may not carry `update-type:`.
    Both are used; there must be a level for every `dependency-name:` entry,
    otherwise we cannot vouch for the whole commit (None -> no downgrade).
    """
    explicit = re.findall(r"^\s*update-type:\s*version-update:semver-(major|minor|patch)\s*$", msg, re.M)
    computed = []
    for old, new in re.findall(r"^Updates `[^`]+` from (\S+) to (\S+)\s*$", msg, re.M):
        lvl = _semver_level(old, new)
        if lvl is None:
            return None
        computed.append(lvl)
    if not computed:
        t = re.match(r"^(?:\S+: )?bump \S+ from (\S+) to (\S+)\s*$", msg.split("\n", 1)[0], re.I)
        if t:
            lvl = _semver_level(t.group(1), t.group(2))
            if lvl is None:
                return None
            computed.append(lvl)
    covered = max(len(explicit), len(computed))
    n_deps = len(re.findall(r"^- dependency-name:", msg, re.M))
    if not covered or (n_deps and covered < n_deps):
        return None
    return explicit + computed


def dependabot_update_type(commits):
    """Highest semver level across the commits' declared updates.

    Returns "major", "minor", "patch", or "" when any commit cannot be read
    (fail closed). Grouped updates: the highest level in the group wins.
    """
    if not commits:
        return ""
    best = 0
    for c in commits:
        levels = _commit_update_levels((c.get("commit") or {}).get("message", ""))
        if not levels:
            return ""
        best = max([best] + [UPDATE_RANK[x] for x in levels])
    return {v: k for k, v in UPDATE_RANK.items()}[best]


# --------------------------------------------------------------------------
# tier computation
# --------------------------------------------------------------------------
def compute_tier(pr, files, rules, commits=None):
    """Tier of a PR from its files (and, for Dependabot, its commits)."""
    reasons = []
    tier = 0
    t1_paths = []
    for path, note in changed_paths(files):
        t, why = file_tier(path, rules)
        reasons.append((f"{path} ({note})" if note else path, t, why))
        tier = max(tier, t)
        if t == 1:
            t1_paths.append(path)
    if not files:
        tier = int(rules.get("default_tier", 1))
    author = pr["user"]["login"]
    if author.lower() == DEPENDABOT:
        ut = dependabot_update_type(commits)
        if ut == "major":
            tier = max(tier, 2)
            reasons.append(("(dependabot)", 2, "major version bump"))
        elif ut in ("minor", "patch") and tier <= 1:
            if not all_commits_dependabot(commits):
                reasons.append(("(dependabot)", tier, "not every commit is a verified dependabot[bot] commit; no downgrade"))
            elif not all(is_manifest(p) for p in t1_paths):
                reasons.append(("(dependabot)", tier, "touches a non-manifest file; no downgrade"))
            else:
                tier = 0
                reasons.append(("(dependabot)", 0, f"semver-{ut}, all commits dependabot[bot]"))
        elif tier < 1:
            tier = 1
            reasons.append(("(dependabot)", 1, "update type unknown"))
    return tier, reasons


# --------------------------------------------------------------------------
# merge gates
# --------------------------------------------------------------------------
def automerge_enabled(env=None):
    """Fail closed: only the exact value "true" turns auto-merge on (B1)."""
    env = os.environ if env is None else env
    return (env.get("AUTOMERGE_ENABLED") or "").strip() == "true"


def merge_blocker(pr, repo):
    """Return why this PR must not auto-merge, or None if the guards pass (B4)."""
    if pr.get("state") != "open" or pr.get("draft"):
        return "not open or is a draft"
    base_repo = (pr.get("base", {}).get("repo") or {})
    head_repo = (pr.get("head", {}).get("repo") or {})
    if not head_repo:
        return "head repository is missing (deleted fork?)"
    base_name = (base_repo.get("full_name") or "").lower()
    head_name = (head_repo.get("full_name") or "").lower()
    if not repo or base_name != repo.lower():
        return f"base repo {base_name!r} is not {repo!r}"
    if head_name != base_name:
        return f"head repo {head_name!r} differs from base repo {base_name!r} (fork PR)"
    if pr["base"]["ref"] != base_repo.get("default_branch"):
        return "base is not the default branch"
    login = ((pr.get("user") or {}).get("login") or "").lower()
    if login not in AUTOMERGE_AUTHORS:
        return f"author {login!r} is not an auto-merge account"
    labels = {l["name"] for l in pr.get("labels", [])}
    if labels & BLOCKING_LABELS:
        return f"blocking label(s): {sorted(labels & BLOCKING_LABELS)}"
    return None


def ci_green(sha):
    runs = gh_json("api", f"repos/{REPO}/actions/runs?head_sha={sha}&per_page=50") or {}
    ci = [r for r in runs.get("workflow_runs", []) if r["name"] == CI_WORKFLOW]
    if not ci:
        return False, "no CI run for head commit"
    latest = max(ci, key=lambda r: r["run_number"])
    if latest["status"] != "completed":
        return False, f"CI {latest['status']}"
    return latest["conclusion"] == "success", f"CI {latest['conclusion']}"


def try_merge(pr, rules):
    """Squash-merge a PR only if a fresh classification says T0 (B1-B5)."""
    n = pr["number"]
    if not automerge_enabled():
        print(f"#{n}: auto-merge is off (AUTOMERGE_ENABLED is not 'true'); not merging")
        return False
    # Never trust the event payload or labels: start from the live PR.
    pr = gh_json("api", f"repos/{REPO}/pulls/{n}")
    why = merge_blocker(pr, REPO)
    if why:
        print(f"#{n}: not auto-merging: {why}")
        return False
    sha = pr["head"]["sha"]
    files = gh_pages(f"repos/{REPO}/pulls/{n}/files", MAX_FILES)
    commits = gh_pages(f"repos/{REPO}/pulls/{n}/commits", MAX_COMMITS)
    if len(files) >= MAX_FILES or len(commits) >= MAX_COMMITS:
        print(f"#{n}: too many files/commits to classify safely; not merging")
        return False
    if not commits or commits[-1]["sha"] != sha:
        print(f"#{n}: commit list does not end at head {sha[:7]}; head moved, will retry")
        return False
    tier, _ = compute_tier(pr, files, rules, commits)
    if tier != 0:
        print(f"#{n}: fresh classification at {sha[:7]} is T{tier}, not T0; leaving for its owner/reviewer")
        return False
    ok, why = ci_green(sha)
    if not ok:
        print(f"#{n}: T0 at {sha[:7]} but {why}; will retry when CI completes")
        return False
    print(f"#{n}: T0 at {sha[:7]} and CI green -> squash merge pinned to that commit")
    r = gh("pr", "merge", str(n), "--repo", REPO, "--squash",
           "--match-head-commit", sha, check=False)
    if r.returncode != 0:
        print(f"::warning title=Merge of #{n} failed::{r.stderr.strip()}")
        return False
    return True


# --------------------------------------------------------------------------
# labelling
# --------------------------------------------------------------------------
def ensure_labels():
    for name, (color, desc) in LABEL_META.items():
        gh("label", "create", name, "--repo", REPO, "--color", color,
           "--description", desc, "--force", check=False)


def current_tier_labels(pr):
    return [l["name"] for l in pr.get("labels", []) if l["name"] in TIER_LABELS.values()]


def verified_by_warnings(number):
    commits = gh_pages(f"repos/{REPO}/pulls/{number}/commits", MAX_COMMITS)
    warns = []
    for c in commits:
        msg = c["commit"]["message"]
        author = (c["commit"]["author"] or {}).get("name", "")
        agent = re.search(r"^Agent:\s*(.+)$", msg, re.M)
        for m in re.finditer(r"^Verified-by:\s*(.+)$", msg, re.M):
            v = m.group(1).strip().lower()
            actors = {author.lower(), author.split(" [")[0].lower()}
            if agent:
                actors.add(agent.group(1).strip().lower())
            if v in actors or any(a and a in v for a in actors):
                warns.append(f"{c['sha'][:7]}: Verified-by '{m.group(1).strip()}' is the author ({author}). No bot verifies its own work.")
    return warns


def summary(text):
    p = os.environ.get("GITHUB_STEP_SUMMARY")
    if p:
        with open(p, "a") as fh:
            fh.write(text + "\n")
    print(text)


def label_mode(number, rules):
    pr = gh_json("api", f"repos/{REPO}/pulls/{number}")
    files = gh_pages(f"repos/{REPO}/pulls/{number}/files", MAX_FILES)
    commits = gh_pages(f"repos/{REPO}/pulls/{number}/commits", MAX_COMMITS)
    tier, reasons = compute_tier(pr, files, rules, commits)
    if len(files) >= MAX_FILES or len(commits) >= MAX_COMMITS:
        tier = max(tier, 2)
        reasons.append(("(too many files/commits)", 2, "cannot classify every change"))
    existing = [int(l.split(":")[1]) for l in current_tier_labels(pr)]
    if existing and max(existing) > tier:
        summary(f"Keeping manually escalated tier:{max(existing)} (computed tier:{tier}).")
        tier = max(existing)
    ensure_labels()
    want = TIER_LABELS[tier]
    for l in current_tier_labels(pr):
        if l != want:
            gh("pr", "edit", str(number), "--repo", REPO, "--remove-label", l, check=False)
    gh("pr", "edit", str(number), "--repo", REPO, "--add-label", want)
    lines = [f"### Risk tier: T{tier}", "", "Policy: divineforge/sentinel `docs/team/OWNERSHIP.md`", "",
             "| file | tier | rule |", "|---|---|---|"]
    for f, t, why in reasons[:200]:
        lines.append(f"| `{f}` | T{t} | `{why}` |")
    summary("\n".join(lines))
    for w in verified_by_warnings(number):
        print(f"::warning title=Self-verification::{w}")
    try_merge(pr, rules)


def sweep_mode(rules):
    if not automerge_enabled():
        print("auto-merge is off (AUTOMERGE_ENABLED is not 'true'); sweep does nothing")
        return
    prs = gh_json("pr", "list", "--repo", REPO, "--state", "open", "--label", "tier:0",
                  "--json", "number", "--limit", "50") or []
    for p in prs:
        try_merge({"number": p["number"]}, rules)


def load_rules(path=None):
    path = path or os.environ.get("RISK_TIERS_FILE", ".github/risk-tiers.yml")
    with open(path) as fh:
        rules = yaml.safe_load(fh)
    rules["tiers"] = {int(k): v for k, v in rules.get("tiers", {}).items()}
    return rules


def main():
    mode = sys.argv[1]
    if mode == "label":
        label_mode(int(os.environ["PR_NUMBER"]), load_rules())
    elif mode == "sweep":
        sweep_mode(load_rules())
    elif mode == "explain":  # local: risk_tier.py explain <file>...
        rules = load_rules()
        for f in sys.argv[2:]:
            print(f, *file_tier(f, rules))
    else:
        sys.exit(f"unknown mode {mode!r}")


if __name__ == "__main__":
    main()
