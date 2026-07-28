/**
 * Remove local-only routes from the production dist.
 * /proposal is for Tailscale review via StackySentinel — never ship to CF Pages.
 */
import { rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const targets = ["proposal", "proposal.html"];

for (const name of targets) {
  const p = join(root, "dist", name);
  if (existsSync(p)) {
    rmSync(p, { recursive: true, force: true });
    console.log(`[strip-local-only] removed dist/${name}`);
  }
}
