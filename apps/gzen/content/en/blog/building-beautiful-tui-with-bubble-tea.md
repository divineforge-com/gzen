---
title: "Building Beautiful Terminal UIs with Bubble Tea"
description: "A practical guide to building interactive terminal applications in Go using the Bubble Tea framework and the Charm ecosystem."
date: 2026-07-16
tags: ["tui", "bubble-tea", "charm", "cli"]
author: "GZen.io"
---

The terminal doesn't have to be boring. With [Bubble Tea](https://github.com/charmbracelet/bubbletea), you can build rich, interactive terminal user interfaces (TUIs) in Go using an elegant Elm-inspired architecture.

## Why Bubble Tea?

Before Bubble Tea, building TUIs in Go meant reaching for `tview`, `termui`, or raw `ncurses` bindings. These work, but they often feel imperative and stateful. Bubble Tea brings a **functional, declarative model** to terminal UI:

- **Model** — your application state
- **Update** — a function that returns a new model in response to messages
- **View** — a function that renders your model as a string

This unidirectional data flow makes reasoning about complex terminal apps much easier.

## Your First Bubble Tea App

Let's build a minimal counter app:

```go
package main

import (
    "fmt"
    "os"
    tea "github.com/charmbracelet/bubbletea"
)

type model int

func (m model) Init() tea.Cmd { return nil }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.KeyMsg:
        switch msg.String() {
        case "ctrl+c", "q":
            return m, tea.Quit
        case "up":
            return m + 1, nil
        case "down":
            return m - 1, nil
        }
    }
    return m, nil
}

func (m model) View() string {
    return fmt.Sprintf("Count: %d\n\n↑ increment · ↓ decrement · q quit", int(m))
}

func main() {
    p := tea.NewProgram(model(0))
    if _, err := p.Run(); err != nil {
        fmt.Println("Error:", err)
        os.Exit(1)
    }
}
```

Run with `go run main.go` and you have a working interactive TUI in under 50 lines.

## The Charm Ecosystem

Bubble Tea is part of the larger [Charm](https://charm.sh) ecosystem:

| Library | Purpose |
|---------|---------|
| **Bubble Tea** | TUI framework (Model-View-Update) |
| **Lip Gloss** | Styling — colors, alignment, margins |
| **Bubbles** | Pre-built components (text input, spinner, progress bar) |
| **Glamour** | Render Markdown in the terminal |
| **Wish** | SSH-based TUIs (remote apps over SSH) |

### Adding Lip Gloss Styling

```go
import "github.com/charmbracelet/lipgloss"

var style = lipgloss.NewStyle().
    Bold(true).
    Foreground(lipgloss.Color("#FAFAFA")).
    Background(lipgloss.Color("#7C3AED")).
    Padding(1, 2).
    Margin(1, 0)

func (m model) View() string {
    return style.Render(fmt.Sprintf("Count: %d", int(m)))
}
```

## Practical Patterns

### Timers and Ticks

Bubble Tea uses commands (`tea.Cmd`) for side effects. A common pattern is the tick command for periodic updates:

```go
type tickMsg time.Time

func tickEvery() tea.Cmd {
    return tea.Every(time.Second, func(t time.Time) tea.Msg {
        return tickMsg(t)
    })
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tickMsg:
        // Update model every second
        return m, tickEvery() // Re-schedule
    }
    return m, nil
}
```

### Working with Windows

Bubble Tea handles terminal resize events automatically:

```go
type model struct {
    width  int
    height int
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
    switch msg := msg.(type) {
    case tea.WindowSizeMsg:
        m.width = msg.Width
        m.height = msg.Height
    }
    return m, nil
}
```

## When to Use Bubble Tea

| Use Case | Recommendation |
|----------|---------------|
| **Interactive CLI** (forms, wizards) | Bubble Tea |
| **Simple command-line tool** | Cobra + standard flags |
| **Dashboard / monitoring** | Bubble Tea + Lip Gloss |
| **File manager / editor** | Bubble Tea + Bubbles |
| **SSH-based app** | Bubble Tea + Wish |

## Resources

- [Bubble Tea GitHub](https://github.com/charmbracelet/bubbletea)
- [Charm ecosystem](https://charm.sh)
- [Bubble Tea tutorial](https://github.com/charmbracelet/bubbletea/tree/master/tutorials)

The terminal is a canvas — Bubble Tea gives you the brushes.
