## 2024-05-18 - Language Switcher Accessibility
**Learning:** Screen readers need `hreflang` and `lang` attributes on language switcher links to apply the proper pronunciation profiles. Without these, the screen reader may attempt to read translated language names using the current page's language rules, resulting in confusing audio output.
**Action:** Always include `hreflang` and `lang` matching the target language code in multilingual navigation menus.

## 2024-05-18 - Hugo Version Compatibility
**Learning:** The Cloudflare Pages deployment environment uses Hugo v0.147.7-extended. When running `pnpm install`, newer versions of `hugo-extended` (like v0.162.1) might be installed locally, which introduce deprecation warnings and errors that fail the CI build (e.g., `.Language.LanguageName` being deprecated in v0.158.0+).
**Action:** Always maintain compatibility with Hugo v0.147.7 and avoid upgrading `hugo-extended` beyond `^0.147.0` in `package.json` to prevent CI build failures.
