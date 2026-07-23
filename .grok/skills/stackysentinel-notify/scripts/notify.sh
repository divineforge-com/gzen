#!/usr/bin/env bash
# StackySentinel Telegram notify — share a ready preview/deploy with William.
# Usage:
#   notify.sh "Title" "Body markdown/HTML-ish plain" [url]
#   notify.sh --html "<b>Title</b>\n..." 
# Env:
#   TELEGRAM_BOT_TOKEN   preferred (StackySentinel / @divineforgeBot)
#   STACKYSENTINEL_CHAT_ID  default 162481195
#   STACKY_SECRETS_ENV   default divineforge stacky secrets path
set -euo pipefail

SECRETS="${STACKY_SECRETS_ENV:-/home/ubuntu/development/divineforge/rustypandora/stacky/secrets.env}"
CHAT_ID="${STACKYSENTINEL_CHAT_ID:-162481195}"

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" && -f "$SECRETS" ]]; then
  # shellcheck disable=SC1090
  set -a
  # shellcheck source=/dev/null
  source "$SECRETS"
  set +a
fi

if [[ -z "${TELEGRAM_BOT_TOKEN:-}" ]]; then
  echo "error: TELEGRAM_BOT_TOKEN not set and secrets not found at $SECRETS" >&2
  exit 1
fi

USE_HTML=0
if [[ "${1:-}" == "--html" ]]; then
  USE_HTML=1
  shift
  TEXT="${1:-}"
else
  TITLE="${1:-Update}"
  BODY="${2:-}"
  URL="${3:-}"
  TEXT="🔔 <b>${TITLE}</b>"
  if [[ -n "$BODY" ]]; then
    TEXT+=$'\n\n'"${BODY}"
  fi
  if [[ -n "$URL" ]]; then
    TEXT+=$'\n\n'"🔗 <a href=\"${URL}\">${URL}</a>"
  fi
  USE_HTML=1
fi

if [[ -z "${TEXT:-}" ]]; then
  echo "usage: $0 \"Title\" \"Body\" [url]" >&2
  echo "   or: $0 --html \"<b>msg</b>\"" >&2
  exit 1
fi

# Build JSON safely
PAYLOAD="$(python3 - <<'PY' "$CHAT_ID" "$TEXT"
import json, sys
chat_id = int(sys.argv[1]) if sys.argv[1].lstrip("-").isdigit() else sys.argv[1]
text = sys.argv[2]
print(json.dumps({
    "chat_id": chat_id,
    "text": text,
    "parse_mode": "HTML",
    "disable_web_page_preview": False,
}))
PY
)"

RESP="$(curl -sS --max-time 20 \
  -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")"

python3 - <<'PY' "$RESP"
import json, sys
d = json.loads(sys.argv[1])
if not d.get("ok"):
    print("telegram error:", d, file=sys.stderr)
    sys.exit(1)
mid = (d.get("result") or {}).get("message_id")
print(f"ok message_id={mid} via @divineforgeBot (StackySentinel)")
PY
