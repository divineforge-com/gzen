## 2024-07-14 - Multilingual Screen Reader Support
**Learning:** Language switchers that display native language names (e.g., "日本語", "中文") need explicit `lang` and `hreflang` attributes. Without them, screen readers try to pronounce foreign characters using the current page's language profile, leading to garbled or skipped announcements.
**Action:** Always add `lang="{code}" hreflang="{code}"` to language selection links to ensure proper screen reader pronunciation profiles are applied.
