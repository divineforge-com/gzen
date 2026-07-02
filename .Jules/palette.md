## 2024-05-18 - Language Switcher Accessibility
**Learning:** Screen readers need `hreflang` and `lang` attributes on language switcher links to apply the proper pronunciation profiles. Without these, the screen reader may attempt to read translated language names using the current page's language rules, resulting in confusing audio output.
**Action:** Always include `hreflang` and `lang` matching the target language code in multilingual navigation menus.
