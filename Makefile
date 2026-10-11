# gZen.io Hugo site. Cloudflare Pages runs `make build` and serves ./public.
#
#   make tools   download the pinned Hugo extended and lychee into ./.bin (CI does this)
#   make build   build the WASM games, then the site into ./public
#   make serve   local preview with drafts on http://localhost:1313
#   make check   strict builds (--panicOnWarning, with and without drafts) + offline link check of ./public

HUGO_VERSION   := 0.167.0
LYCHEE_VERSION := 0.24.2

BIN    := $(CURDIR)/.bin
PUBLIC := $(CURDIR)/public
export PATH := $(BIN):$(PATH)

UNAME_S := $(shell uname -s | tr A-Z a-z)
UNAME_M := $(shell uname -m)
HUGO_ARCH := $(if $(filter x86_64,$(UNAME_M)),amd64,$(if $(filter aarch64 arm64,$(UNAME_M)),arm64,$(UNAME_M)))

.PHONY: build wasm site serve check check-strict check-links tools clean version

build: wasm site

wasm:
	./scripts/build-wasm.sh

site: version
	cd site && hugo --gc --minify

serve:
	cd site && hugo server --buildDrafts --bind 0.0.0.0 --port 1313

check: wasm check-strict check-links

check-strict: version
	cd site && hugo --gc --minify --panicOnWarning
	cd site && hugo --gc --minify --panicOnWarning --buildDrafts --destination "$$(mktemp -d)"

check-links:
	lychee --offline --no-progress --include-fragments --root-dir "$(PUBLIC)" "$(PUBLIC)/**/*.html"

version:
	@hugo version | grep -q "v$(HUGO_VERSION)" || echo "warning: expected Hugo v$(HUGO_VERSION), got: $$(hugo version)" >&2

tools: $(BIN)/hugo $(BIN)/lychee

$(BIN)/hugo:
	mkdir -p "$(BIN)"
	curl -fsSL "https://github.com/gohugoio/hugo/releases/download/v$(HUGO_VERSION)/hugo_extended_$(HUGO_VERSION)_$(UNAME_S)-$(HUGO_ARCH).tar.gz" | tar -xz -C "$(BIN)" hugo

$(BIN)/lychee:
	mkdir -p "$(BIN)"
	curl -fsSL "https://github.com/lycheeverse/lychee/releases/download/lychee-v$(LYCHEE_VERSION)/lychee-$(UNAME_M)-unknown-linux-gnu.tar.gz" | tar -xz -C "$(BIN)" --strip-components=1 --wildcards '*/lychee'

clean:
	rm -rf "$(PUBLIC)" site/resources/_gen site/.hugo_build.lock
