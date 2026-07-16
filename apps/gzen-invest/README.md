# invest.gzen

Visual investment knowledge platform — dividends, capital growth, technical analysis & market insights — delivered through hand-drawn SVG infographics.

## Stack
- **Hugo** — static site generator, zero JS build step
- **Caveat font** — hand-drawn aesthetic
- **Plain CSS** — no Tailwind, no preprocessor
- **TradingView widgets** — live market data (vault page)

## Pages
| Route | Content |
|-------|---------|
| `/` | Investment pyramid SVG, compound interest curves, topic nav cards |
| `/dividends/` | Dividend flow + DRIP + ex-date cycle, top MY/US dividend stocks table |
| `/growth/` | Capital growth strategy mind map, DCA visual, value vs growth |
| `/technical/` | Stochastic, RSI/MACD/Bollinger/Fibonacci cheatsheet, candlestick patterns |
| `/vault/` | Malaysia vs US market, broker matrix, TradingView live charts |
| `/learn/` | Weekly learning routine, portfolio KPI, glossary, mental models, book recs |

## Development
```bash
hugo server -D
```

## Build
```bash
hugo --minify
```

## Deploy
Hugo generates static files in `public/`. Deploy to any static host (Netlify, Vercel, Cloudflare Pages).
