## 2026-07-18 - [Accessibility] Multilingual Language Switcher Links Need `hreflang` and `lang` Attributes
**Learning:** Screen readers rely on `hreflang` and `lang` attributes on links (like language switchers) to apply the correct pronunciation profile for the target language. Without them, the text may be read in the wrong accent or not at all.
**Action:** Always ensure that when creating or updating language switcher links, both `hreflang` and `lang` attributes are added with the target language code.
