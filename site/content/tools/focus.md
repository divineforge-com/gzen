---
# Example content from design/mockups/tool.html. Stays a draft until github.com/divineforge/zen-focus exists
# and the VHS demo is recorded (TODO: Kinetic).
title: "Focus timer"
draft: true
weight: 10
description: "A Pomodoro that breathes with you. No accounts, no cloud."
lede: "A Pomodoro that breathes with you. Pick a length, close the other tabs, and let the bar fill."
tag: "TUI"
install: "go install github.com/divineforge/zen-focus@latest"
minGo: "1.24"
platforms: ["macOS", "Linux", "Windows"]
source: "https://github.com/divineforge/zen-focus"
license: "MIT"
demo: ""
keys:
  - { key: "space", does: "pause or resume" }
  - { key: "s", does: "skip to the next phase" }
  - { key: "q", does: "quit quietly" }
builtWith: "Bubble Tea, Bubbles and Lip Gloss. A few hundred lines. Read it in one sitting."
card: "zen-001"
---

## How to use it

Run `zen-focus` for a 25-minute session with a 5-minute break, or pass your own lengths.

{{< install "zen-focus -focus 50m -break 10m" >}}
