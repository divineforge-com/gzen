# agents.md — gzen Development Progress

This file tracks the development of the gzen language learning site. It guides AI agents and contributors on current status, what needs doing, and how to add content.

---

## 🏁 Phase 1 — Foundation (Complete ✅)

- [x] Hugo site scaffold (`hugo new site`)
- [x] `hugo.toml` configured (baseURL, unsafe HTML for furigana, taxonomies)
- [x] Custom theme — no external theme dependency
  - [x] `layouts/_default/baseof.html` — HTML shell
  - [x] `layouts/_default/single.html` — lesson page with sidebar + progress
  - [x] `layouts/_default/list.html` — course index grid
  - [x] `layouts/index.html` — homepage with hero + 30-day calendar grid
  - [x] `layouts/partials/` — head, header, footer
- [x] Shortcodes: `furigana`, `vocab`, `grammar`, `quiz`
- [x] `static/css/main.css` — full theme (JP red / RU blue, responsive, furigana ruby styling)
- [x] `static/js/main.js` — quiz reveal, localStorage progress, mobile nav, speech synthesis
- [x] `.gitignore` — excludes `public/`, `resources/`
- [x] `.github/workflows/deploy.yml` — Cloudflare Pages CI/CD

---

## 📚 Phase 2 — Japanese Content (In Progress)

### Days 1–10: N3 Core Grammar ✅
- [x] Day 1 — て-form connections
- [x] Day 2 — Conditional と
- [x] Day 3 — Potential form
- [x] Day 4 — Passive voice
- [x] Day 5 — Causative form
- [x] Day 6 — Giving/receiving verbs (あげる・もらう・くれる)
- [x] Day 7 — Regret: 〜ばよかった
- [x] Day 8 — Relative clauses
- [x] Day 9 — ながら (while doing)
- [x] Day 10 — てしまう (completed/regrettable)

### Days 11–20: N2 Grammar ✅
- [x] Day 11 — 〜に対して (towards / in contrast)
- [x] Day 12 — 〜によって (by / depending on)
- [x] Day 13 — 〜わけだ / わけではない
- [x] Day 14 — 〜にもかかわらず (despite)
- [x] Day 15 — 〜ばかりでなく (not only… but also)
- [x] Day 16 — 〜ことになっている (supposed to)
- [x] Day 17 — 〜ものの (although)
- [x] Day 18 — 〜さえ〜ば (if only)
- [x] Day 19 — 〜てからでないと (not until after)
- [x] Day 20 — 〜とともに (together with / as … so …)

### Days 21–30: N1 Advanced Grammar ✅
- [x] Day 21 — 〜を余儀なくされる (be forced to)
- [x] Day 22 — 〜に際して (on the occasion of)
- [x] Day 23 — 〜かねない (might / could possibly)
- [x] Day 24 — 〜ざるを得ない (cannot help but)
- [x] Day 25 — 〜にほかならない (nothing but)
- [x] Day 26 — 〜ならいざ知らず (I don't know about X, but…)
- [x] Day 27 — 〜を踏まえて (based on / taking into account)
- [x] Day 28 — 〜たりとも〜ない (not even one)
- [x] Day 29 — 〜もさることながら (not to mention)
- [x] Day 30 — N1 Review & Exam Strategy

---

## 🇷🇺 Phase 3 — Russian Content ✅

- [x] Day 1 — The Cyrillic Alphabet
- [x] Day 2 — Pronunciation Rules
- [x] Day 3 — Greetings & Introductions
- [x] Day 4 — Numbers 1–20
- [x] Day 5 — Colors & Basic Adjectives
- [x] Day 6 — Nouns & Grammatical Gender
- [x] Day 7 — Personal Pronouns
- [x] Day 8 — To Be (быть) & Present Tense
- [x] Day 9 — Nominative & Accusative Case
- [x] Day 10 — Common Verbs (everyday actions)
- [x] Day 11 — Genitive Case (possession)
- [x] Day 12 — Dative Case (to/for)
- [x] Day 13 — Instrumental Case (with/by)
- [x] Day 14 — Prepositional Case (about/in)
- [x] Day 15 — Verb Aspects (imperfective vs perfective)
- [x] Day 16 — Past Tense
- [x] Day 17 — Future Tense
- [x] Day 18 — Adjective Agreement
- [x] Day 19 — Common Phrases & Travel Russian
- [x] Day 20 — Reading Practice & Review

---

## 🌐 Phase 4 — Hosting & Deployment ✅

- [x] `.github/workflows/deploy.yml` — Cloudflare Pages via GitHub Actions
- [x] `README.md` with hosting guide (Cloudflare Pages + Vercel)
- [x] Framework comparison (Hugo vs Next.js vs Gatsby)
- [ ] Custom domain setup (requires owner action in Cloudflare dashboard)
- [ ] Add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` to GitHub Secrets

### Secrets needed from repo owner

| Secret | Purpose | Where to add |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy to Cloudflare Pages | GitHub → Settings → Secrets → Actions |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier | GitHub → Settings → Secrets → Actions |

---

## 🔮 Phase 5 — Future Enhancements

- [ ] Audio pronunciation files (MP3) for vocabulary
- [ ] Spaced repetition quiz mode (SRS)
- [ ] User accounts / cloud progress sync
- [ ] Mobile app (PWA manifest)
- [ ] More Japanese content: kanji stroke order diagrams
- [ ] Russian: audio by native speaker
- [ ] Dark mode toggle
- [ ] Search across all lessons

---

## 🤖 Agent Instructions

When adding lessons, always follow this pattern:

**File location**: `content/japanese/day-NN.md` or `content/russian/day-NN.md`

**Required front matter fields**:
- `title` — short English title
- `day` — integer day number
- `language` — `"japanese"` or `"russian"`
- `level` — `"N3"`, `"N2"`, `"N1"` for JP; `"A1"`, `"A2"`, `"B1"`, `"B2"` for RU
- `kanji` / `icon` — 1-2 character icon for the calendar grid
- `summary` — one sentence description

**Content must include**:
1. Vocabulary table with furigana (JP) or stress marks (RU)
2. Grammar pattern explanation with structure table
3. At least 3 example sentences with translations
4. A reading passage (3–5 sentences)
5. At least 3 `{{< quiz >}}` shortcodes

**Quality standards**:
- All Japanese must use `<ruby>` furigana on every kanji
- Examples must be natural, not textbook-stiff
- Grammar explanations must include nuance/usage notes
- Russian must show Cyrillic with transliteration for early lessons
