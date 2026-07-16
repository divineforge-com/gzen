/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./assets/**/*.js",
    "./static/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#d97845",
          50:  "#fff8f5",
          100: "#fce7d6",
          200: "#f8d4bc",
          300: "#f4bfa0",
          400: "#eeaa84",
          500: "#d97845",
          600: "#c45a2a",
          700: "#a0401e",
          800: "#7c2e15",
          900: "#5a200e",
        },
        warm: {
          cream: "#fffaf4",
          surface: "#fff4e8",
          ink: "#2f2118",
          muted: "#7c624d",
          border: "#ead9c3",
        },
        go: {
          blue: "#00ADD8",
          cyan: "#5DC9E2",
          gopher: "#8AC149",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Noto Sans SC"', 'ui-monospace', 'monospace'],
        sans: [
          '"Noto Sans SC"',
          '"Noto Sans JP"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          '"Noto Serif SC"',
          '"Noto Serif JP"',
          '"Georgia"',
          'serif',
        ],
        code: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs:   ["0.75rem",  { lineHeight: "1.5" }],
        sm:   ["0.875rem", { lineHeight: "1.6" }],
        base: ["1rem",     { lineHeight: "1.75" }],
        lg:   ["1.125rem", { lineHeight: "1.75" }],
        xl:   ["1.25rem",  { lineHeight: "1.75" }],
        "2xl": ["1.5rem",  { lineHeight: "1.6" }],
        "3xl": ["1.875rem",{ lineHeight: "1.4" }],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in",
        "hero-rise": "heroRise 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "code-blink": "blink 1s step-end infinite",
        "terminal-glow": "terminalGlow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        heroRise: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        terminalGlow: {
          "0%": { boxShadow: "0 0 8px rgba(0, 173, 216, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 173, 216, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};
