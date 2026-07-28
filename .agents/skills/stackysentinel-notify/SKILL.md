---
name: stackysentinel-notify
description: >
  Notify William via the StackySentinel Telegram bot (@divineforgeBot) when a
  preview, deploy, or visible change is ready to review. Use after finishing
  UI/site work, starting a local preview, or applying production changes —
  especially gzen.io / Tailscale rustypandora previews. Triggers: "notify me",
  "stackysentinel", "stacky sentinel", "telegram when ready", "share preview",
  "changes applied", /stackysentinel-notify. Development technique: always
  push a ready-to-view link when the user should look with their eyes.
---

# StackySentinel notify — when changes are ready to see

## Rule (development technique)

When you **apply changes the user should visually review** (site UI, deploy, local preview, favicon, design polish):

1. Make the change available (dev server / build / CF deploy).
2. **Notify via StackySentinel** with a short message + clickable URL.
3. Do **not** wait for the user to ask “where do I look?”

This is the default close-out for visual work on this machine.

## Bot identity

| | |
|--|--|
| Display | **Stacky-Sentinels Mk V** |
| Username | **@divineforgeBot** |
| Chat | `162481195` (William) |
| Token | `TELEGRAM_BOT_TOKEN` in `dforge/rustypandora/stacky/secrets.env` (fallback: `divineforge/...`) |

**Not Nova.** Nova is `@novananamiBot` (Hermes). Do not use Nova for these review pings unless the user asks.

## How to send

### Preferred: helper script

```bash
~/.grok/skills/stackysentinel-notify/scripts/notify.sh \
  "gZen.IO preview ready" \
  "Astro portal + square doors. Open on tailnet." \
  "http://rustypandora.banjo-scala.ts.net:1318"
```

HTML body:

```bash
~/.grok/skills/stackysentinel-notify/scripts/notify.sh --html \
  "✨ <b>gZen.IO live</b>

• <a href=\"https://gzen.io\">https://gzen.io</a>
• Tailscale: <a href=\"http://rustypandora.banjo-scala.ts.net:1318\">preview</a>"
```

### Fallback: curl + secrets

```bash
set -a
source /home/ubuntu/development/divineforge/rustypandora/stacky/secrets.env
set +a

python3 - <<'PY'
import json, os, urllib.request
token = os.environ["TELEGRAM_BOT_TOKEN"]
text = """🔔 <b>Ready to review</b>

<a href="http://rustypandora.banjo-scala.ts.net:1318">Tailscale preview</a>
"""
body = json.dumps({
    "chat_id": 162481195,
    "text": text,
    "parse_mode": "HTML",
}).encode()
req = urllib.request.Request(
    f"https://api.telegram.org/bot{token}/sendMessage",
    data=body,
    headers={"Content-Type": "application/json"},
    method="POST",
)
with urllib.request.urlopen(req, timeout=20) as r:
    print(r.read().decode())
PY
```

## Message template

Keep it scannable:

```
🔔 <title — what changed>
• what to look at (1–3 bullets)
• primary URL (Tailscale and/or production)
• optional: deploy id / generator / port
```

### Common URLs (rustypandora)

| Surface | URL |
|---------|-----|
| gZen portal dev | `http://rustypandora.banjo-scala.ts.net:1318` |
| short host | `http://rustypandora:1318` |
| Tailscale IP | `http://100.90.23.65:1318` |
| Production | `https://gzen.io` |

Port **1318** = Astro portal (`apps/gzen`). Confirm with `ss`/`curl` if unsure.

| Surface | URL |
|---------|-----|
| **gZen asset proposals (local only)** | `http://rustypandora.banjo-scala.ts.net:1318/proposal` |

`/proposal` is **dev-only**. Production build strips it (`npm run build` → `strip-local-only.mjs`). Never publish mark drafts to gzen.io.

### Function command: `/proposal`

**In Telegram** (Stacky-Sentinels / `@divineforgeBot` menu):

- Tap **Menu → proposal** or send `/proposal`
- Bot replies with Tailscale + IP links to the local gZen asset gallery
- Implemented in Go: `dforge/rustypandora/nova/main.go` → binary `stacky-telegram` → `systemctl restart stacky-telegram`

**From agents / CLI** (outbound notify, no need for user to type `/proposal`):

```bash
# from anywhere — uses notify.sh under the hood
~/.grok/skills/stackysentinel-notify/scripts/proposal.sh

# health only
~/.grok/skills/stackysentinel-notify/scripts/proposal.sh --check

# or from portal app
cd apps/gzen && npm run proposal
```

Agent triggers: “send proposal”, “/proposal”, “logo review”, “favicon proposals”, “asset gallery”.

**Shipped mark:** `enso-g` (favicon on portal). Gallery still lists alternates for future review.

After sending: William opens the link, replies with a mark id if changing (e.g. `orbit-g`).

## When to fire

| Event | Notify? |
|-------|---------|
| UI / design / favicon / layout change + preview running | **Yes** |
| Production CF deploy finished | **Yes** |
| Backend-only / no visible surface | Optional |
| Mid-task WIP, not viewable yet | No |

## Verify bot before first use in a session

```bash
set -a; source /home/ubuntu/development/divineforge/rustypandora/stacky/secrets.env; set +a
curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe"
# expect: "username":"divineforgeBot"
```

## Security

- Never print or commit `TELEGRAM_BOT_TOKEN`.
- Source `secrets.env`; do not paste tokens into chat or git.
- Chat whitelist is William only for this workflow (`162481195`).

## Related

- Nova bot ops (different bot): hermes skill `nova-telegram-bot`
- gZen brand: `gzen-branding` skill
