# 学 gzen — Japanese & Russian Language Learning

A daily language-learning site built with **Hugo** — structured like an advent calendar.  
One lesson per day: Japanese (JLPT N3 → N1) and Russian (beginner → advanced).

---

## 🚀 Quick Start (Local)

```bash
# 1. Install Hugo Extended (≥ 0.124)
#    macOS:
brew install hugo
#    Linux:
wget https://github.com/gohugoio/hugo/releases/download/v0.124.1/hugo_extended_0.124.1_linux-amd64.tar.gz
tar -xzf hugo_extended_*.tar.gz && sudo mv hugo /usr/local/bin/

# 2. Clone the repo
git clone https://github.com/divineforge/learn.gzen.git
cd learn.gzen

# 3. Run dev server
hugo server -D
# → Open http://localhost:1313
```

---

## 🏗 Framework Decision: Hugo vs Next.js vs Gatsby

| | **Hugo** ✅ Chosen | **Next.js** | **Gatsby** |
|---|---|---|---|
| **Build speed** | ⚡ Fastest (sub-second) | Moderate | Slow (GraphQL layer) |
| **Language content** | Markdown + shortcodes, perfect | JSX needed for every page | MDX works but more setup |
| **Furigana/Ruby** | Native HTML in markdown | Custom component needed | Plugin ecosystem |
| **Hosting options** | Any static host | Vercel-preferred (serverless) | Netlify-preferred |
| **JS required** | None (optional) | React everywhere | React everywhere |
| **Learning curve** | Low | High (React + Next APIs) | High (GraphQL + plugins) |
| **SEO** | Excellent (pure HTML) | Excellent (SSR/SSG) | Excellent (SSG) |
| **i18n** | Built-in | Built-in | Plugin needed |
| **Cost** | Free on any CDN | Free on Vercel (limits apply) | Free on Netlify (limits apply) |

**Verdict**: Hugo is the best fit for a content-heavy language learning site. Pages are pure static HTML — no JavaScript runtime needed, instant loads worldwide via CDN, and markdown with raw HTML support makes furigana trivial.

---

## ☁️ Hosting: Cloudflare Pages (Recommended)

### Why Cloudflare Pages?
- **Free unlimited bandwidth** (Vercel caps at 100 GB/month on free tier)
- **Built-in global CDN** — fastest delivery for learners worldwide
- **Automatic HTTPS** and custom domain support
- **Preview deployments** on every pull request
- Hugo is natively supported (no extra buildpack needed)

### Setup Steps

#### Option A — GitHub Integration (No API key needed)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Connect your GitHub account and select `divineforge/learn.gzen`
3. Configure build settings:
   - **Framework preset**: Hugo
   - **Build command**: `hugo --minify`
   - **Build output directory**: `public`
   - **Environment variable**: `HUGO_VERSION` = `0.124.1`
4. Click **Save and Deploy** — done! No secrets needed for this method.

#### Option B — GitHub Actions CI/CD (Automated on push)

Add these secrets to your GitHub repository  
(**Settings → Secrets and variables → Actions → New repository secret**):

| Secret Name | Where to find it | Required? |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template | ✅ Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → right sidebar on any page | ✅ Yes |

The workflow file `.github/workflows/deploy.yml` is already included in this repo.

#### Getting Your Cloudflare API Token

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click your profile (top right) → **My Profile**
3. Go to **API Tokens** → **Create Token**
4. Use the **"Edit Cloudflare Workers"** template OR create a custom token with:
   - Permission: **Cloudflare Pages — Edit**
   - Account Resources: Include your account
5. Copy the token → paste into GitHub Secret as `CLOUDFLARE_API_TOKEN`
6. Find your Account ID: Cloudflare Dashboard → any domain → right sidebar shows **Account ID**

---

## 🌐 Alternative: Vercel

Vercel also works great for Hugo.

| Secret Name | Where to find it |
|---|---|
| `VERCEL_TOKEN` | vercel.com → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | vercel.com → Settings → General → Team ID |
| `VERCEL_PROJECT_ID` | Your Vercel project → Settings → General → Project ID |

Or simply use Vercel's GitHub integration (no secrets needed):
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `divineforge/learn.gzen`
3. Framework: **Other** (Hugo)
4. Build command: `hugo --minify`
5. Output directory: `public`
6. Add env var: `HUGO_VERSION=0.124.1`

---

## 📝 Adding New Lessons

### Japanese lesson

```yaml
---
title: "Your Lesson Title"
day: 31
language: "japanese"
level: "N1"          # N3, N2, or N1
kanji: "学"          # 1-2 kanji representing the theme
summary: "One sentence describing this lesson."
tags: ["grammar", "N1"]
---
```

### Russian lesson

```yaml
---
title: "The Cyrillic Alphabet"
day: 1
language: "russian"
level: "A1"
icon: "А"            # single Cyrillic letter as icon
summary: "Learn the Russian alphabet."
tags: ["alphabet", "A1"]
---
```

### Shortcodes

**Furigana:**
```
{{</* furigana "日本語" "にほんご" */>}}
```

**Vocab card:**
```
{{</* vocab word="言葉" reading="ことば" meaning="word / language" */>}}
```

**Grammar box:**
```
{{</* grammar pattern="〜てしまう" meaning="Completed / regrettable action" lang="jp" */>}}
食べてしまった。(*I ate it all — oops.*)
{{</* /grammar */>}}
```

**Quiz:**
```
{{</* quiz question="て-form of 飲む?" answer="飲んで (のんで)" */>}}
```

---

## 📁 Project Structure

```
learn.gzen/
├── hugo.toml                  # Site config
├── content/
│   ├── japanese/day-01..30.md # 30 Japanese lessons
│   └── russian/day-01..20.md  # 20 Russian lessons
├── layouts/
│   ├── index.html             # Homepage (calendar grid)
│   ├── _default/              # baseof, single, list
│   ├── partials/              # head, header, footer
│   └── shortcodes/            # furigana, vocab, grammar, quiz
├── static/
│   ├── css/main.css           # Full theme + furigana styles
│   └── js/main.js             # Progress tracking, quiz, TTS
└── .github/workflows/
    └── deploy.yml             # Auto-deploy to Cloudflare Pages
```

---

## 🗺 Content Roadmap

### Japanese (30 days, N3 → N1)
- Days 1–10: N3 core grammar ✅
- Days 11–20: N2 grammar patterns
- Days 21–30: N1 advanced grammar

### Russian (20 days, A1 → B2)
- Days 1–5: Alphabet & pronunciation
- Days 6–10: Nouns, pronouns, gender
- Days 11–15: Verbs & cases
- Days 16–20: Expanded vocabulary & reading

---

## 🛠 Local Development Tips

```bash
hugo server -D --disableFastRender   # live reload with drafts
hugo --minify                         # production build → public/
```
