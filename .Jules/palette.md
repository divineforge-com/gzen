## 2024-07-04 - Language Switcher Accessibility
**Learning:** Screen readers rely on `lang` attributes to determine the correct pronunciation profile for text. In multilingual sites, simply changing the text or having an `aria-label` isn't enough; each language link in a switcher needs `lang` and `hreflang` to ensure it's read accurately by assistive technology.
**Action:** When building or updating multilingual components, always include `lang` and `hreflang` attributes indicating the target language code for each switcher item.
