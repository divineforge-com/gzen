---
title: "Bubble Tea basics for calm terminal apps"
draft: true
date: 2026-10-09
description: "Learn the Model, Update and View loop of Bubble Tea by building a small breathing pacer for the terminal."
tags: ["go", "cli", "tui"]
card: "zen-022"
heroAlt: "Three smooth grey stones rest in shallow water on a sunset beach, ringed by soft ripples as a low wave rolls in under an orange sky."
---

In the last post we built a focus timer with nothing but the standard library. It drew one line and rewrote it with a
carriage return. That trick goes a long way, but it stops the moment you want to read a single keypress or redraw more
than one line. For that, Go has a lovely library called [Bubble Tea](https://github.com/charmbracelet/bubbletea).

Bubble Tea gives you one simple shape for a whole terminal app. Once you see the shape, every Bubble Tea program
becomes easy to read. In this post we learn it by building something small and gentle: a breathing pacer.

## What we are building

The pacer shows a row of dots that grows while you breathe in and shrinks while you breathe out:

```text
  breathe in   ● ● ●

  breaths: 2

  space: pause · q: quit
```

Each half-breath lasts four seconds, so one full breath takes eight. Press space to pause and space again to carry on.
Press `q` or Ctrl+C to leave. The dots are all there is, and that is the point.

## The whole program

Make an empty folder, start a module and fetch Bubble Tea:

```sh
go mod init breathe
go get github.com/charmbracelet/bubbletea@v1.3.10
```

Version 1.3.10 needs Go 1.24 or newer. Then save this as `main.go`:

```go
// breathe is a tiny breathing pacer for the terminal, built with Bubble Tea.
package main

import (
	"fmt"
	"os"
	"strings"
	"time"

	tea "github.com/charmbracelet/bubbletea"
)

const steps = 4 // seconds per breath in, and per breath out

// tickMsg arrives once a second.
type tickMsg time.Time

// model is the whole state of the app.
type model struct {
	inhale  bool // true while breathing in
	step    int  // seconds into the current half-breath
	breaths int  // full breaths finished
	paused  bool
}

func tick() tea.Cmd {
	return tea.Tick(time.Second, func(t time.Time) tea.Msg { return tickMsg(t) })
}

func (m model) Init() tea.Cmd { return tick() }

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		case " ":
			m.paused = !m.paused
		}
	case tickMsg:
		if !m.paused {
			m.step++
			if m.step == steps {
				m.step = 0
				if !m.inhale {
					m.breaths++
				}
				m.inhale = !m.inhale
			}
		}
		return m, tick()
	}
	return m, nil
}

func (m model) View() string {
	size := m.step + 1
	label := "breathe in "
	if !m.inhale {
		size = steps - m.step
		label = "breathe out"
	}
	if m.paused {
		label = "paused     "
	}
	circle := strings.Repeat("● ", size) + strings.Repeat("  ", steps-size)
	return fmt.Sprintf("\n  %s  %s\n\n  breaths: %d\n\n  space: pause · q: quit\n",
		label, circle, m.breaths)
}

func main() {
	p := tea.NewProgram(model{inhale: true})
	if _, err := p.Run(); err != nil {
		fmt.Fprintln(os.Stderr, "breathe:", err)
		os.Exit(1)
	}
}
```

Run it with `go run .` and breathe along. Now let's look at how it fits together.

## One shape: Model, Update, View

Bubble Tea follows the Elm Architecture. That sounds grand, but it comes down to three pieces:

- A **model** holds the state. Ours is four fields: which way we are breathing, how far along we are, how many
  breaths are done, and whether we are paused.
- **Update** receives a message, such as a keypress or a tick, and returns the next model.
- **View** turns the model into a string. Bubble Tea puts that string on the screen.

That is the whole loop. A message arrives, `Update` decides what changes, `View` describes the result, and Bubble Tea
draws it. You never move the cursor yourself, and you never clear the screen by hand.

Notice that `Update` and `View` have value receivers. `Update` gets a copy of the model, changes the copy and hands it
back. Nothing else touches the state, so there is only ever one place to look when something seems wrong.

## Messages are just values

A message can be any Go type. Bubble Tea sends its own, like `tea.KeyMsg` for keys, and we add ours: `tickMsg` is
simply `time.Time` with a new name. The type switch in `Update` sorts them out.

For keys, `msg.String()` gives a friendly name: `"q"`, `" "` for the space bar, `"ctrl+c"`. Bubble Tea puts the
terminal into raw mode for us, which is why single keypresses arrive at once, with no Enter needed. In raw mode Ctrl+C
no longer stops the program on its own; it arrives as a key like any other. That is why we handle it ourselves, next
to `q`, and return `tea.Quit`.

## Commands do the waiting

`Update` must return quickly. It should never sleep, read files or wait on the network. Slow work goes into a
**command**, a `tea.Cmd`: a function that Bubble Tea runs for you in the background, whose result comes back later as
a message.

`tea.Tick` builds such a command. It waits one second, then delivers whatever message our little function returns,
here a `tickMsg`. `Init` sends the first tick when the program starts.

A tick fires only once. To keep time flowing, every `tickMsg` returns a fresh `tick()`. While we are paused we still
schedule the next tick; we just don't move forward. That keeps exactly one tick in flight at all times, so pausing
and resuming quickly can never start a second clock running alongside the first.

## A view is only a string

`View` doesn't print anything. It returns a string, and Bubble Tea's renderer works out what to repaint on the screen.
Our view is several lines tall, which is exactly what the carriage-return trick from the focus timer could not do.

The dots count up from one to four while breathing in, then down from four to one while breathing out. Because the
fourth dot shows on the last second in and again on the first second out, the full circle holds for two seconds at
the top, and the single dot holds for two at the bottom. It feels like a natural pause, so we kept it.

The label is padded to the same width in every state, so the dots never jump left or right.

## Testing without a terminal

Since `Update` is an ordinary function, you can test it without a terminal at all. Send eight `tickMsg` values to a
fresh model and check that `breaths` is 1. Send a space, then a tick, and check that nothing moved. Send `q` and check
that the returned command produces a `tea.QuitMsg`. That is how we checked this program while writing it, along with
running it for real and breathing along.

## What we left out

There is no colour, no settings and no sound. The breath length is a constant, not a flag. Bubble Tea's companion
library Lip Gloss could add colour and borders, and a `-steps` flag would be a short change. Each is a good next step,
and each can wait until you want it.

## A calm mind

A breathing pacer asks very little of you: watch the dots, follow them, and let the rest go for a minute. Bubble Tea
asks very little of you too. Hold your state in one place, change it in one place, and describe it in one place.

Once that shape feels familiar, bigger terminal apps stop feeling big. They are the same loop with more messages.
That is the idea behind gZen: simple Go tools for a calm mind.
