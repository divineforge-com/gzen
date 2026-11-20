#!/usr/bin/env python3
"""Risk-tier labeller and T0 auto-merge for STACKy repos.

Policy: divineforge/sentinel docs/team/OWNERSHIP.md (decision rights).
Path rules: .github/risk-tiers.yml (read from the BASE branch, never the PR).

Modes:
  label  - compute the PR tier, set exactly one tier:N label (escalate-only),
           warn when a commit's author equals its Verified-by trailer,
           then try to merge if the PR is T0 and CI is green.
  sweep  - try to merge every open tier:0 PR whose CI is green.

Kill switch: repo variable AUTOMERGE_ENABLED=false (env AUTOMERGE_ENABLED).
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


def gh(*args, check=True):
    r = subprocess.run(["gh", *args], capture_output=True, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"gh {' '.join(args)} failed: {r.stderr.strip()}")
    return r.stdout


def gh_json(*args):
    out = gh(*args)
    return json.loads(out) if out.strip() else None


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


def compute_tier(pr, files, rules):
    reasons = []
    tier = 0
    for f in files:
        t, why = file_tier(f, rules)
        reasons.append((f, t, why))
        tier = max(tier, t)
    if not files:
        tier = int(rules.get("default_tier", 1))
    author = pr["user"]["login"]
    update_type = os.environ.get("DEPENDABOT_UPDATE_TYPE", "")
    if author == "dependabot[bot]":
        if update_type == "version-update:semver-major":
            tier = max(tier, 2)
            reasons.append(("(dependabot)", 2, "major version bump"))
        elif update_type in ("version-update:semver-minor", "version-update:semver-patch") and tier <= 1:
            tier = 0
            reasons.append(("(dependabot)", 0, update_type))
        elif tier < 1:
            tier = 1
    return tier, reasons


def ensure_labels():
    for name, (color, desc) in LABEL_META.items():
        gh("label", "create", name, "--repo", REPO, "--color", color,
           "--description", desc, "--force", check=False)


def current_tier_labels(pr):
    return [l["name"] for l in pr.get("labels", []) if l["name"] in TIER_LABELS.values()]


def verified_by_warnings(number):
    commits = gh_json("api", f"repos/{REPO}/pulls/{number}/commits?per_page=100") or []
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


def ci_green(sha):
    runs = gh_json("api", f"repos/{REPO}/actions/runs?head_sha={sha}&per_page=50") or {}
    ci = [r for r in runs.get("workflow_runs", []) if r["name"] == CI_WORKFLOW]
    if not ci:
        return False, "no CI run for head commit"
    latest = max(ci, key=lambda r: r["run_number"])
    if latest["status"] != "completed":
        return False, f"CI {latest['status']}"
    return latest["conclusion"] == "success", f"CI {latest['conclusion']}"


def try_merge(pr):
    n = pr["number"]
    if os.environ.get("AUTOMERGE_ENABLED", "").lower() == "false":
        print(f"#{n}: kill switch on (AUTOMERGE_ENABLED=false); not merging")
        return
    labels = {l["name"] for l in pr.get("labels", [])}
    if pr.get("state") != "open" or pr.get("draft"):
        return
    if pr["base"]["ref"] != pr["base"]["repo"]["default_branch"]:
        return
    if "tier:0" not in labels or labels & {"tier:1", "tier:2", "tier:3", "do-not-merge", "hold"}:
        print(f"#{n}: not T0 (labels: {sorted(labels)}); leaving for its owner/reviewer")
        return
    ok, why = ci_green(pr["head"]["sha"])
    if not ok:
        print(f"#{n}: T0 but {why}; will retry when CI completes")
        return
    print(f"#{n}: T0 and CI green -> squash merge")
    gh("pr", "merge", str(n), "--repo", REPO, "--squash",
       "--match-head-commit", pr["head"]["sha"], check=False)


def summary(text):
    p = os.environ.get("GITHUB_STEP_SUMMARY")
    if p:
        with open(p, "a") as fh:
            fh.write(text + "\n")
    print(text)


def label_mode(number, rules):
    pr = gh_json("api", f"repos/{REPO}/pulls/{number}")
    files = [f["filename"] for f in gh_json("api", "--paginate", f"repos/{REPO}/pulls/{number}/files?per_page=100") or []]
    tier, reasons = compute_tier(pr, files, rules)
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
    pr = gh_json("api", f"repos/{REPO}/pulls/{number}")
    try_merge(pr)


def sweep_mode():
    prs = gh_json("pr", "list", "--repo", REPO, "--state", "open", "--label", "tier:0",
                  "--json", "number", "--limit", "50") or []
    for p in prs:
        try_merge(gh_json("api", f"repos/{REPO}/pulls/{p['number']}"))


def main():
    mode = sys.argv[1]
    if mode == "label":
        with open(os.environ.get("RISK_TIERS_FILE", ".github/risk-tiers.yml")) as fh:
            rules = yaml.safe_load(fh)
        rules["tiers"] = {int(k): v for k, v in rules.get("tiers", {}).items()}
        label_mode(int(os.environ["PR_NUMBER"]), rules)
    elif mode == "sweep":
        sweep_mode()
    elif mode == "explain":  # local: risk_tier.py explain <file>...
        with open(".github/risk-tiers.yml") as fh:
            rules = yaml.safe_load(fh)
        rules["tiers"] = {int(k): v for k, v in rules.get("tiers", {}).items()}
        for f in sys.argv[2:]:
            print(f, *file_tier(f, rules))


if __name__ == "__main__":
    main()
