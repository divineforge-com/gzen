## 2024-07-07 - Add lang toggle ID and a11y attributes
**Learning:** For multilingual support and accessibility, language switcher links must include `hreflang` and `lang` attributes matching the target language code to ensure proper screen reader pronunciation profiles are applied. Additionally, the language toggle script requires `id="lang-toggle"` on the container and `data-lang` on links.
**Action:** Add `id="lang-toggle"` to `<nav class="gzen-languages">` and add `data-lang`, `lang`, and `hreflang` attributes to the language links in `layouts/partials/header/basic.html`.
