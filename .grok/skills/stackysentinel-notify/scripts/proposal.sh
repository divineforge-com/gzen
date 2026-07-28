#!/usr/bin/env bash
# StackySentinel · /proposal — push the local-only gZen asset gallery link.
#
# Usage:
#   proposal.sh              # notify with default Tailscale URL
#   proposal.sh --check      # only print URLs / health (no Telegram)
#   proposal.sh --html "…"   # custom HTML body (advanced)
#
# Local-only page: apps/gzen  →  /proposal  (stripped from production build)
# Dev server: port 1318
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
NOTIFY="${ROOT}/notify.sh"

PORT="${GZEN_PORTAL_PORT:-1318}"
HOST_TS="${GZEN_TAILSCALE_HOST:-rustypandora.banjo-scala.ts.net}"
HOST_IP="${GZEN_TAILSCALE_IP:-100.90.23.65}"

URL_TS="http://${HOST_TS}:${PORT}/proposal"
URL_IP="http://${HOST_IP}:${PORT}/proposal"
URL_LOCAL="http://localhost:${PORT}/proposal"
PORTAL="http://${HOST_TS}:${PORT}/"

check_up() {
  curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 2 "http://127.0.0.1:${PORT}/proposal" 2>/dev/null || echo "000"
}

if [[ "${1:-}" == "--check" ]]; then
  code="$(check_up)"
  echo "portal :${PORT} /proposal → HTTP ${code}"
  echo "  ${URL_TS}"
  echo "  ${URL_IP}"
  echo "  ${URL_LOCAL}"
  if [[ "$code" != "200" ]]; then
    echo "hint: cd apps/gzen && npm run dev" >&2
    exit 1
  fi
  exit 0
fi

code="$(check_up)"
if [[ "$code" != "200" ]]; then
  echo "warn: /proposal not serving on :${PORT} (HTTP ${code}). Starting note only — open after dev is up." >&2
fi

if [[ "${1:-}" == "--html" ]]; then
  shift
  exec "$NOTIFY" --html "${1:-}"
fi

NOTE="${1:-}"
BODY="Brand asset gallery (local only · never on gzen.io)

• Marks: enso-g · orbit-g · ignite-g · void-g
• <b>Shipped mark:</b> enso-g (favicon)
• Wordmark + favicon size checks
• Reply in chat with a mark id to switch (e.g. orbit-g)

<a href=\"${URL_TS}\">${URL_TS}</a>
· <a href=\"${URL_IP}\">IP</a>
· portal <a href=\"${PORTAL}\">${PORTAL}</a>"

if [[ -n "$NOTE" ]]; then
  BODY="${NOTE}

${BODY}"
fi

exec "$NOTIFY" --html "🎨 <b>gZen /proposal</b>

${BODY}"
