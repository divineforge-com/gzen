#!/usr/bin/env python3
"""Unit tests for risk_tier.py (stdlib unittest; needs only PyYAML).

Run:  GITHUB_REPOSITORY=<owner/repo> python3 -m unittest discover -s .github/scripts -p 'test_*.py' -v

Generic logic is tested against an inline rule set. The repo's real
.github/risk-tiers.yml is checked for the policy every repo must satisfy,
plus per-repo expectations keyed by GITHUB_REPOSITORY.
"""
import os
import unittest
from unittest import mock

import risk_tier as rt

HERE = os.path.dirname(os.path.abspath(__file__))
RULES_FILE = os.path.join(HERE, "..", "risk-tiers.yml")

INLINE_RULES = {
    "default_tier": 1,
    "tiers": {
        3: ["ads.txt", "**/ZenAdSlot*"],
        2: [".github/**", "AGENTS.md", "SOUL.md", "**/secrets/**"],
        0: ["docs/**", "content/**"],
    },
}


def pr(author="divineforge", **kw):
    base = {
        "number": 7, "state": "open", "draft": False, "user": {"login": author},
        "labels": [{"name": "tier:0"}],
        "base": {"ref": "main", "repo": {"full_name": "o/r", "default_branch": "main"}},
        "head": {"sha": "a" * 40, "repo": {"full_name": "o/r"}},
    }
    base.update(kw)
    return base


def dep_commit(update_type="patch", login="dependabot[bot]", verified=True, sha="a" * 40):
    msg = ("Bump foo from 1.0.0 to 1.0.1\n\n---\nupdated-dependencies:\n- dependency-name: foo\n"
           f"  update-type: version-update:semver-{update_type}\n...\n")
    return {"sha": sha, "author": {"login": login}, "commit": {"message": msg, "verification": {"verified": verified}}}


class FileTier(unittest.TestCase):
    def tier(self, path):
        return rt.file_tier(path, INLINE_RULES)[0]

    def test_basics(self):
        self.assertEqual(self.tier("docs/a.md"), 0)
        self.assertEqual(self.tier("src/main.go"), 1)
        self.assertEqual(self.tier(".github/workflows/ci.yml"), 2)
        self.assertEqual(self.tier("apps/x/ZenAdSlot.astro"), 3)

    def test_t2_beats_t0(self):
        self.assertEqual(self.tier("docs/AGENTS.md"), 2)
        self.assertEqual(self.tier("content/secrets/x.md"), 2)

    def test_steering_files_any_path_case_insensitive(self):
        for p in ("AGENTS.md", "a/b/AGENTS.md", "agents.md", "x/SOUL.md"):
            self.assertEqual(self.tier(p), 2, p)


class Renames(unittest.TestCase):
    def test_rename_into_docs_keeps_t2(self):
        files = [{"filename": "docs/ci.md", "previous_filename": ".github/workflows/ci.yml", "status": "renamed"}]
        tier, reasons = rt.compute_tier(pr(), files, INLINE_RULES)
        self.assertEqual(tier, 2)
        self.assertEqual(len(reasons), 2)  # old and new path both reported

    def test_rename_out_of_ad_file_is_t3(self):
        files = [{"filename": "docs/x.md", "previous_filename": "apps/a/ZenAdSlot.astro"}]
        self.assertEqual(rt.compute_tier(pr(), files, INLINE_RULES)[0], 3)

    def test_rename_between_t0_paths_stays_t0(self):
        files = [{"filename": "docs/b.md", "previous_filename": "docs/a.md"}]
        self.assertEqual(rt.compute_tier(pr(), files, INLINE_RULES)[0], 0)

    def test_plain_paths_still_work(self):
        self.assertEqual(rt.compute_tier(pr(), ["docs/a.md"], INLINE_RULES)[0], 0)

    def test_empty_file_list_uses_default(self):
        self.assertEqual(rt.compute_tier(pr(), [], INLINE_RULES)[0], 1)


class Dependabot(unittest.TestCase):
    dep = staticmethod(lambda: pr("dependabot[bot]"))

    def tier(self, files, commits):
        return rt.compute_tier(self.dep(), files, INLINE_RULES, commits)[0]

    def test_clean_patch_bump_is_t0(self):
        self.assertEqual(self.tier([{"filename": "package.json"}, {"filename": "package-lock.json"}], [dep_commit()]), 0)

    def test_minor_in_subdir_manifest_is_t0(self):
        self.assertEqual(self.tier([{"filename": "apps/gzen/package-lock.json"}], [dep_commit("minor")]), 0)

    def test_major_is_t2(self):
        self.assertEqual(self.tier([{"filename": "package.json"}], [dep_commit("major")]), 2)

    def test_grouped_update_uses_highest_type(self):
        c = dep_commit("patch")
        c["commit"]["message"] += "- dependency-name: bar\n  update-type: version-update:semver-major\n"
        self.assertEqual(self.tier([{"filename": "package.json"}], [c]), 2)

    def test_mixed_commits_do_not_downgrade(self):
        human = dep_commit("patch", login="someone")
        self.assertEqual(self.tier([{"filename": "package.json"}, {"filename": "src/evil.js"}],
                                   [dep_commit(), human]), 1)

    def test_extra_human_commit_adding_code_stays_t1(self):
        human = dep_commit("patch", login="someone")
        self.assertEqual(self.tier([{"filename": "package.json"}, {"filename": "src/evil.js"}], [dep_commit(), human]), 1)

    def test_unverified_dependabot_commit_does_not_downgrade(self):
        self.assertEqual(self.tier([{"filename": "package.json"}], [dep_commit(verified=False)]), 1)

    def test_non_manifest_file_does_not_downgrade(self):
        self.assertEqual(self.tier([{"filename": "src/evil.js"}], [dep_commit()]), 1)

    def test_workflow_file_stays_t2(self):
        self.assertEqual(self.tier([{"filename": ".github/workflows/ci.yml"}], [dep_commit()]), 2)

    def test_no_commits_given_means_no_downgrade(self):
        self.assertEqual(self.tier([{"filename": "package.json"}], None), 1)

    def test_missing_update_type_is_t1(self):
        c = dep_commit()
        c["commit"]["message"] = "Bump foo"
        self.assertEqual(self.tier([{"filename": "package.json"}], [c]), 1)

    def test_real_dependabot_group_commit_without_update_type(self):
        # Current Dependabot omits `update-type:`; levels come from "Updates ... from A to B".
        msg = ("chore(deps): bump the npm_and_yarn group with 2 updates (#9)\n\n"
               "Updates `devalue` from 5.8.2 to 5.9.4\nUpdates `js-yaml` from 4.3.0 to 4.3.2\n\n---\n"
               "updated-dependencies:\n- dependency-name: devalue\n  dependency-version: 5.9.4\n"
               "  dependency-group: npm_and_yarn\n- dependency-name: js-yaml\n  dependency-version: 4.3.2\n...\n")
        c = dep_commit()
        c["commit"]["message"] = msg
        self.assertEqual(rt.dependabot_update_type([c]), "minor")
        self.assertEqual(self.tier([{"filename": "package-lock.json"}], [c]), 0)
        c["commit"]["message"] = msg.replace("4.3.0 to 4.3.2", "4.3.0 to 5.0.0")
        self.assertEqual(rt.dependabot_update_type([c]), "major")
        self.assertEqual(self.tier([{"filename": "package-lock.json"}], [c]), 2)

    def test_group_commit_missing_a_dependency_fails_closed(self):
        msg = ("chore(deps): bump the g group with 2 updates (#9)\n\nUpdates `a` from 1.0.0 to 1.0.1\n\n---\n"
               "updated-dependencies:\n- dependency-name: a\n- dependency-name: b\n...\n")
        c = dep_commit()
        c["commit"]["message"] = msg
        self.assertEqual(rt.dependabot_update_type([c]), "")
        self.assertEqual(self.tier([{"filename": "package.json"}], [c]), 1)

    def test_title_only_single_bump(self):
        c = dep_commit()
        c["commit"]["message"] = "chore(deps): bump foo from 1.2.3 to 1.3.0\n\nBumps foo.\n"
        self.assertEqual(rt.dependabot_update_type([c]), "minor")

    def test_zero_dot_x_minor_counts_as_major(self):
        c = dep_commit()
        c["commit"]["message"] = "bump foo from 0.4.1 to 0.5.0\n"
        self.assertEqual(rt.dependabot_update_type([c]), "major")

    def test_helpers(self):
        self.assertTrue(rt.all_commits_dependabot([dep_commit()]))
        self.assertFalse(rt.all_commits_dependabot([]))
        self.assertEqual(rt.dependabot_update_type([dep_commit("minor"), dep_commit("patch")]), "minor")
        self.assertEqual(rt.dependabot_update_type([]), "")


class KillSwitch(unittest.TestCase):
    def test_fails_closed(self):
        for v in (None, "", "false", "FALSE", "1", "yes", "True ", "tru", " false"):
            self.assertFalse(rt.automerge_enabled({"AUTOMERGE_ENABLED": v} if v is not None else {}), repr(v))

    def test_only_true_enables(self):
        self.assertTrue(rt.automerge_enabled({"AUTOMERGE_ENABLED": "true"}))
        self.assertTrue(rt.automerge_enabled({"AUTOMERGE_ENABLED": " true\n"}))

    def test_unset_env_is_off(self):
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop("AUTOMERGE_ENABLED", None)
            self.assertFalse(rt.automerge_enabled())

    def test_workflow_gate_is_fail_closed(self):
        with open(os.path.join(HERE, "..", "workflows", "automerge.yml")) as fh:
            wf = fh.read()
        self.assertIn("vars.AUTOMERGE_ENABLED == 'true'", wf)
        self.assertNotIn("!= 'false'", wf)


class MergeBlocker(unittest.TestCase):
    def test_same_repo_own_author_passes(self):
        self.assertIsNone(rt.merge_blocker(pr(), "o/r"))
        self.assertIsNone(rt.merge_blocker(pr("dependabot[bot]"), "o/r"))
        self.assertIsNone(rt.merge_blocker(pr("DivineForge"), "o/r"))

    def test_fork_never_merges(self):
        fork = pr(head={"sha": "b" * 40, "repo": {"full_name": "stranger/r"}})
        self.assertIn("fork", rt.merge_blocker(fork, "o/r"))

    def test_deleted_fork_never_merges(self):
        self.assertIn("missing", rt.merge_blocker(pr(head={"sha": "b" * 40, "repo": None}), "o/r"))

    def test_fork_from_own_account_name_still_blocked(self):
        fork = pr(head={"sha": "b" * 40, "repo": {"full_name": "divineforge/r"}})
        self.assertIsNotNone(rt.merge_blocker(fork, "o/r"))

    def test_stranger_author_blocked_even_same_repo(self):
        self.assertIn("not an auto-merge account", rt.merge_blocker(pr("stranger"), "o/r"))

    def test_other_blockers(self):
        self.assertIsNotNone(rt.merge_blocker(pr(draft=True), "o/r"))
        self.assertIsNotNone(rt.merge_blocker(pr(state="closed"), "o/r"))
        self.assertIsNotNone(rt.merge_blocker(pr(labels=[{"name": "hold"}]), "o/r"))
        self.assertIsNotNone(rt.merge_blocker(pr(labels=[{"name": "tier:2"}]), "o/r"))
        other_base = pr(base={"ref": "dev", "repo": {"full_name": "o/r", "default_branch": "main"}})
        self.assertIsNotNone(rt.merge_blocker(other_base, "o/r"))

    def test_wrong_repo_context_blocked(self):
        self.assertIsNotNone(rt.merge_blocker(pr(), "o/other"))
        self.assertIsNotNone(rt.merge_blocker(pr(), ""))


class TryMerge(unittest.TestCase):
    """try_merge with GitHub mocked out: classification is fresh, merge pinned."""

    def run_try(self, files, enabled="true", live_pr=None, commits=None, ci=(True, "CI success")):
        live_pr = live_pr or pr()
        commits = commits if commits is not None else [dep_commit(login="divineforge", sha="a" * 40)]
        merge_calls = []

        def fake_gh(*args, check=True):
            merge_calls.append(args)
            return mock.Mock(returncode=0, stdout="", stderr="")

        def fake_pages(path, limit):
            return files if path.endswith("/files") else commits

        env = {"AUTOMERGE_ENABLED": enabled} if enabled is not None else {}
        with mock.patch.dict(os.environ, env, clear=False), \
                mock.patch.object(rt, "REPO", "o/r"), \
                mock.patch.object(rt, "gh_json", return_value=live_pr), \
                mock.patch.object(rt, "gh_pages", side_effect=fake_pages), \
                mock.patch.object(rt, "ci_green", return_value=ci), \
                mock.patch.object(rt, "gh", side_effect=fake_gh):
            if enabled is None:
                os.environ.pop("AUTOMERGE_ENABLED", None)
            merged = rt.try_merge({"number": 7}, INLINE_RULES)
        return merged, merge_calls

    def test_t0_merges_pinned_to_head_sha(self):
        merged, calls = self.run_try([{"filename": "docs/a.md"}])
        self.assertTrue(merged)
        self.assertEqual(len(calls), 1)
        args = list(calls[0])
        self.assertEqual(args[args.index("--match-head-commit") + 1], "a" * 40)

    def test_disabled_or_unset_does_nothing(self):
        for v in (None, "", "false", "TRUE-ish"):
            merged, calls = self.run_try([{"filename": "docs/a.md"}], enabled=v)
            self.assertFalse(merged, repr(v))
            self.assertEqual(calls, [])

    def test_stale_tier0_label_is_ignored(self):
        # Label says tier:0 (from pr()), but the head now touches a workflow.
        merged, calls = self.run_try([{"filename": "docs/a.md"}, {"filename": ".github/workflows/x.yml"}])
        self.assertFalse(merged)
        self.assertEqual(calls, [])

    def test_rename_of_workflow_into_docs_not_merged(self):
        merged, _ = self.run_try([{"filename": "docs/x.md", "previous_filename": ".github/workflows/ci.yml"}])
        self.assertFalse(merged)

    def test_fork_pr_not_merged(self):
        fork = pr(head={"sha": "a" * 40, "repo": {"full_name": "stranger/r"}})
        merged, calls = self.run_try([{"filename": "docs/a.md"}], live_pr=fork)
        self.assertFalse(merged)
        self.assertEqual(calls, [])

    def test_head_moved_not_merged(self):
        stale = [dep_commit(login="divineforge", sha="c" * 40)]
        merged, _ = self.run_try([{"filename": "docs/a.md"}], commits=stale)
        self.assertFalse(merged)

    def test_ci_not_green_not_merged(self):
        merged, calls = self.run_try([{"filename": "docs/a.md"}], ci=(False, "CI failure"))
        self.assertFalse(merged)
        self.assertEqual(calls, [])

    def test_dependabot_with_extra_human_commit_not_merged(self):
        live = pr("dependabot[bot]")
        commits = [dep_commit(), dep_commit(login="someone", sha="a" * 40)]
        merged, _ = self.run_try([{"filename": "package.json"}], live_pr=live, commits=commits)
        self.assertFalse(merged)

    def test_clean_dependabot_patch_merges(self):
        live = pr("dependabot[bot]")
        merged, _ = self.run_try([{"filename": "package.json"}, {"filename": "package-lock.json"}],
                                 live_pr=live, commits=[dep_commit()])
        self.assertTrue(merged)


class RepoPolicy(unittest.TestCase):
    """The repo's real .github/risk-tiers.yml."""

    @classmethod
    def setUpClass(cls):
        cls.rules = rt.load_rules(RULES_FILE)

    def tier(self, path):
        return rt.file_tier(path, self.rules)[0]

    def test_whole_dot_github_is_t2(self):
        for p in (".github/workflows/ci.yml", ".github/scripts/risk_tier.py", ".github/CODEOWNERS",
                  ".github/risk-tiers.yml", ".github/dependabot.yml", ".github/yamllint.yml",
                  ".github/copilot-instructions.md", ".github/BRANCH_PROTECTION.md",
                  ".github/ISSUE_TEMPLATE/bug.md", ".github/anything/new.txt"):
            self.assertGreaterEqual(self.tier(p), 2, p)

    def test_steering_files_are_t2(self):
        for p in ("AGENTS.md", "CLAUDE.md", ".github/copilot-instructions.md", "SOUL.md", "MEMORY.md",
                  "SKILL.md", "docs/AGENTS.md", "content/CLAUDE.md",
                  "machines/rustypandora/hermes/SOUL.md", "machines/rustypandora/hermes/memories/MEMORY.md",
                  "machines/rustypandora/hermes/skills/x/y/SKILL.md", "apps/a/AGENTS.md",
                  ".claude/settings.json", ".claude/agents/x.md", ".codex/hooks.json", ".agents/AGENTS.md"):
            self.assertGreaterEqual(self.tier(p), 2, p)

    def test_plain_docs_and_content_stay_t0(self):
        for p in ("docs/guide.md", "content/post.md", "apps/x/content/post.md"):
            self.assertEqual(self.tier(p), 0, p)

    def test_markdown_outside_docs_and_content_is_not_t0(self):
        for p in ("README.md", "src/notes.md", "scripts/howto.md"):
            self.assertGreaterEqual(self.tier(p), 1, p)

    def test_robots_and_redirects_are_t2(self):
        for p in ("robots.txt", "web/public/robots.txt", "web/public/_redirects", "static/_redirects"):
            self.assertGreaterEqual(self.tier(p), 2, p)

    def test_ads_txt_is_t3(self):
        self.assertEqual(self.tier("static/ads.txt"), 3)

    def test_rename_of_protected_file_stays_protected(self):
        files = [{"filename": "docs/x.md", "previous_filename": ".github/workflows/ci.yml"}]
        self.assertGreaterEqual(rt.compute_tier(pr(), files, self.rules)[0], 2)


# Per-repo expectations: path -> minimum tier. Keyed by GITHUB_REPOSITORY.
REPO_EXPECTATIONS = {
    "divineforge-com/gzen": {
        "apps/gzen/src/components/ZenAdSlot.astro": 3,
        "apps/gzen/src/layouts/BaseLayout.astro": 3,
        "apps/gzen/public/ads.txt": 3,
        "apps/gzen/public/robots.txt": 2,
        "apps/gzen/public/_redirects": 2,
        "apps/enlight/static/_redirects": 2,
        "apps/gzen/src/pages/index.astro": 1,
    },
    "divineforge/reywar": {
        "layouts/partials/article-content-with-ads.html": 3,
        "layouts/partials/adsense.html": 3,
        "layouts/partials/ads/live.html": 3,
        "layouts/partials/cookie-consent.html": 3,
        "layouts/partials/head.html": 3,
        "layouts/partials/extend-head-uncached.html": 3,
        "layouts/partials/extend-head.html": 3,
        "layouts/shortcodes/banner.html": 3,
        "static/js/cookie-consent.js": 3,
        "static/ads.txt": 3,
        "layouts/partials/extend-footer.html": 2,
        "layouts/robots.txt": 2,
        "static/_redirects": 2,
        "content/stories/a-story.md": 0,
    },
    "divineforge/sentinel": {
        "machines/rustypandora/hermes/SOUL.md": 2,
        "machines/rustypandora/hermes/memories/MEMORY.md": 2,
        "machines/rustypandora/hermes/memories/notes.md": 2,
        "machines/rustypandora/hermes/skills/foo/SKILL.md": 2,
        "machines/rustypandora/hermes/skills/foo/references/ref.md": 1,
        "machines/minerva/hermes/auth.json": 2,
        "machines/x/hermes/oauth-token.json": 2,
        "machines/x/server.pem": 2,
        "machines/x/ssh/id_ed25519": 2,
        "machines/rustypandora/crontab.txt": 2,
        "machines/rustypandora/hermes/cron/jobs.json": 2,
        ".github/yamllint.yml": 2,
        "docs/VELOCITY.md": 0,
    },
    "divineforge/dforge": {
        "web/public/robots.txt": 2,
        "web/public/_redirects": 2,
        "web/public/ads.txt": 3,
        ".github/BRANCH_PROTECTION.md": 2,
        "stacky/bin/stacky-git-identity": 2,
        "stacky/VELOCITY.md": 2,
        "web/content/build/post.md": 0,
    },
    "divineforge/hearthstomation": {
        "AGENTS.md": 2,
        "internal/runner/input.go": 1,
        "docs/notes.md": 0,
    },
}


class PerRepoPolicy(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.repo = os.environ.get("GITHUB_REPOSITORY", "")
        cls.rules = rt.load_rules(RULES_FILE)

    def test_expectations(self):
        expect = REPO_EXPECTATIONS.get(self.repo)
        if expect is None:
            self.skipTest(f"no per-repo expectations for {self.repo!r}")
        for path, want in expect.items():
            got = rt.file_tier(path, self.rules)[0]
            if want == 0 or want == 1:
                self.assertEqual(got, want, f"{path}: T{got}, want T{want}")
            else:
                self.assertGreaterEqual(got, want, f"{path}: T{got}, want >= T{want}")
            if want == 3:
                self.assertEqual(got, 3, f"{path}: T{got}, want T3")


if __name__ == "__main__":
    unittest.main()
