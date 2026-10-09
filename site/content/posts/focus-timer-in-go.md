---
title: "A focus timer in 100 lines of Go"
draft: true
date: 2026-10-09
description: "Build a small Pomodoro-style timer for the terminal with nothing but Go's standard library."
tags: ["go", "cli", "focus"]
---

A focus timer is one of the smallest useful programs you can write. It waits, it counts, and it tells you when to stop.
That is the whole job. In this post we build one for the terminal in plain Go: no frameworks, no modules to download,
just `flag`, `time` and `os/signal`. The finished program is under 100 lines, and you can read all of it with one cup of tea.

## What we are building

The timer runs a few rounds of focused work with short breaks in between, in the spirit of the Pomodoro technique.
It draws one line in the terminal and keeps rewriting it:

```text
focus 1/4   █████████░░░░░░░░░░░░░░░░░░░░░ 17:30
```

A label, a bar that fills as time passes, and the time left. When a phase ends it rings the terminal bell and moves on.
Press Ctrl+C at any point and it stops politely, telling you how long you worked.

Three flags shape a session:

- `-work` is the length of one focus session. The default is 25 minutes.
- `-break` is the length of one break. The default is 5 minutes.
- `-rounds` is how many focus sessions to run. The default is 4.

## The whole program

Here it is, all in one file. Save it as `main.go` in an empty folder.

```go
// focus is a tiny Pomodoro-style timer for the terminal.
// Standard library only: flag, time, os/signal.
package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

const barWidth = 30

func main() {
	work := flag.Duration("work", 25*time.Minute, "length of one focus session")
	rest := flag.Duration("break", 5*time.Minute, "length of one break")
	rounds := flag.Int("rounds", 4, "how many focus sessions to run")
	flag.Parse()

	if *work <= 0 || *rest <= 0 || *rounds < 1 {
		fmt.Fprintln(os.Stderr, "focus: lengths must be positive and rounds at least 1")
		os.Exit(2)
	}

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	start := time.Now()
	for i := 1; i <= *rounds; i++ {
		if !phase(fmt.Sprintf("focus %d/%d", i, *rounds), *work, stop) {
			quit(start)
		}
		if i < *rounds && !phase("break", *rest, stop) {
			quit(start)
		}
	}
	fmt.Printf("Done. %d sessions in %s.\n", *rounds, time.Since(start).Round(time.Second))
}

// phase counts down d, redrawing a single line once a second.
// It returns false if the user asked to stop.
func phase(label string, d time.Duration, stop <-chan os.Signal) bool {
	end := time.Now().Add(d) // set before the ticker, so the last tick lands just past it
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	draw(label, d, d)
	for {
		select {
		case <-stop:
			return false
		case now := <-ticker.C:
			left := end.Sub(now)
			if left <= 0 {
				draw(label, 0, d)
				fmt.Print("\a\n") // a soft bell, then keep this line
				return true
			}
			draw(label, left, d)
		}
	}
}

// draw rewrites the current line: label, progress bar, time left.
func draw(label string, left, total time.Duration) {
	filled := int(float64(barWidth) * float64(total-left) / float64(total))
	bar := strings.Repeat("█", filled) + strings.Repeat("░", barWidth-filled)
	fmt.Printf("\r%-11s %s %s ", label, bar, clock(left))
}

// clock formats a duration as mm:ss.
func clock(d time.Duration) string {
	s := int(d.Round(time.Second).Seconds())
	return fmt.Sprintf("%02d:%02d", s/60, s%60)
}

// quit ends the program early, without fuss.
func quit(start time.Time) {
	fmt.Printf("\nStopped after %s. That counts too.\n", time.Since(start).Round(time.Second))
	os.Exit(0)
}
```

To run it, make a module and go:

```sh
go mod init focus
go run . -work 25m -break 5m -rounds 4
```

Now let's walk through it, one piece at a time.

## Flags that speak in time

`flag.Duration` is a quiet gift. It parses the same strings as `time.ParseDuration`, so `25m`, `90s` and `1h15m`
all work, and the value arrives as a `time.Duration`, ready to use. We never convert minutes to seconds by hand.

It also makes testing easy. You don't have to wait 25 minutes to see whether the timer works:

```sh
go run . -work 3s -break 2s -rounds 2
```

That whole run takes about eight seconds. Short durations are how we checked this program while writing it.

The guard after `flag.Parse` turns away a zero or negative length before it can cause trouble. Exit code 2 is the
same code the `flag` package uses for bad arguments, so the program behaves like its neighbours.

## A ticker, not a sleep loop

The heart of the program is `phase`. The first idea most of us have is to call `time.Sleep(time.Second)` in a loop and
count down. That works, but it drifts: each sleep runs a little long, and the work between sleeps adds up.

Instead, `phase` remembers when the phase should end, and a `time.Ticker` wakes it about once a second. On every tick
we ask one honest question: how long until `end`? The answer comes from the clock, not from a counter, so small delays
never pile up. If the machine is busy for a moment, the next tick simply shows the right time.

Notice the order of the first two lines. We compute `end` before creating the ticker, so the final tick lands just
after the end rather than a hair before it. Otherwise the last second would be drawn twice. Small details like this
are easy to miss until you actually run the program.

`defer ticker.Stop()` lets the ticker go when the phase is over. Since Go 1.23 the garbage collector can reclaim a
ticker nobody stopped, but saying so out loud keeps the intent clear: this phase is done, and so is its clock.

## Ctrl+C, handled kindly

By default, Ctrl+C kills a Go program on the spot. The cursor is left halfway along the bar and the prompt lands on
the same line, which looks broken.

`signal.Notify` changes that. It sends the interrupt to our `stop` channel instead, and the `select` inside `phase`
listens to both channels at once: the ticker and the stop request. Whichever speaks first wins. When it is the stop
request, `phase` returns `false`, and `quit` moves to a fresh line and says how long you stayed.

"That counts too" is a deliberate choice. A session you end early still happened. A tool can be firm about time and
still be gentle about people.

We also listen for `SIGTERM`, so a polite shutdown from another program gets the same tidy ending.

## Drawing with a carriage return

There is no screen library here. `draw` starts its line with `\r`, a carriage return, which moves the cursor back to
the start of the current line without moving down. Printing the new line over the old one looks like an update.

Because every line has the same width (the label is padded to 11 characters, the bar is always 30 cells, the clock is
always `mm:ss`), each redraw fully covers the one before it. No leftover characters, no flicker.

The bar is plain arithmetic: the share of time already spent, times the width, rounded down. `strings.Repeat` does
the rest. `clock` rounds to the nearest second and splits it into minutes and seconds.

When a phase ends, `\a` rings the terminal bell. Some terminals beep, some flash, some do nothing. That's fine. The
newline after it keeps the finished bar on screen, so you can scroll back and see the rounds you have done.

## What we left out

There's no pause key. Reading single keypresses means putting the terminal into raw mode, and the standard library
has no portable way to do that. There are no sounds beyond the bell, no notifications and no saved history.

Each of those would be a fine addition. Each would also make the program longer and harder to hold in your head.
For now, the timer does one thing, and you can check every line of it.

## A calm mind

A timer can't make you focus. What it can do is take one small worry off your mind: *how long have I been at this?*
Once that is handled, the rest of your attention is free for the work itself.

Small tools are good at this. They start instantly, they ask nothing of you, and when you read them there are no
surprises. That is the idea behind gZen: simple Go tools for a calm mind.

gZen's own focus timer is on its way, a slightly richer terminal app with pause and skip keys. Until then, this little
one is yours. Change the bar, change the bell, make it fit how you work.
