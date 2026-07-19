---
title: "Concurrency in Go: Goroutines, Channels, and Select"
description: "A deep dive into Go's concurrency primitives — goroutine lifecycle, channel patterns, the select statement, and real-world idioms."
date: 2026-07-16
tags: ["concurrency", "goroutines", "channels", "patterns"]
author: "gZen.io"
---

Go's concurrency model is one of its defining features. Goroutines and channels make concurrent programming more approachable than threads and locks — but they still require care and understanding.

## Goroutines Are Lightweight

A goroutine is a lightweight thread managed by the Go runtime, not the OS. You can start tens of thousands without issue:

```go
func handleRequest(wg *sync.WaitGroup, id int) {
    defer wg.Done()
    // ... work ...
}

var wg sync.WaitGroup
for i := 0; i < 10000; i++ {
    wg.Add(1)
    go handleRequest(&wg, i)
}
wg.Wait()
```

Stack size starts at ~4KB (vs 1MB+ for OS threads) and grows/shrinks as needed.

## Channel Patterns

### 1. Fan-Out, Fan-In

Distribute work across multiple goroutines and collect results:

```go
func fanOut[T any](in <-chan T, workers int) []<-chan T {
    channels := make([]<-chan T, workers)
    for i := 0; i < workers; i++ {
        ch := make(chan T)
        channels[i] = ch
        go func() {
            for v := range in {
                ch <- v
            }
            close(ch)
        }()
    }
    return channels
}

func fanIn[T any](chs ...<-chan T) <-chan T {
    out := make(chan T)
    var wg sync.WaitGroup
    for _, ch := range chs {
        wg.Add(1)
        go func(c <-chan T) {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }(ch)
    }
    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}
```

Usage:

```go
jobs := make(chan Job, 100)
// ... produce jobs ...

workers := fanOut(jobs, runtime.NumCPU())
results := fanIn(workers...)

for result := range results {
    fmt.Println(result)
}
```

### 2. Pipeline Pattern

Each stage takes a channel and returns a channel:

```go
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    pipeline := square(square(generate(1, 2, 3, 4)))
    for v := range pipeline {
        fmt.Println(v) // 1, 16, 81, 256
    }
}
```

### 3. Timeout with Context

```go
func fetchWithTimeout(ctx context.Context, url string) (*http.Response, error) {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, err
    }

    return http.DefaultClient.Do(req)
}
```

## The Select Statement

Select is the switch statement for channels:

### Rate Limiting

```go
type RateLimiter struct {
    ticker *time.Ticker
}

func (r *RateLimiter) Wait(ctx context.Context) error {
    select {
    case <-r.ticker.C:
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}
```

### First-Response Wins

```go
func firstResponse(ctx context.Context, urls []string) (*http.Response, error) {
    ch := make(chan *http.Response, 1)

    for _, url := range urls {
        go func(u string) {
            resp, err := http.Get(u)
            if err == nil {
                select {
                case ch <- resp:
                default: // already have a response
                }
            }
        }(url)
    }

    select {
    case resp := <-ch:
        return resp, nil
    case <-ctx.Done():
        return nil, ctx.Err()
    }
}
```

## Common Mistakes

### 1. Leaking Goroutines

A goroutine blocked on sending to an unbuffered channel with no receiver will leak:

```go
// BAD: leaks if no one reads from ch
go func() {
    ch <- result // blocks forever
}()

// GOOD: use buffered channel or context
go func() {
    select {
    case ch <- result:
    case <-ctx.Done():
    }
}()
```

### 2. Closing Channels

Only the sender should close a channel:

```go
// BAD: multiple goroutines closing the same channel
for _, item := range items {
    go func() {
        // ... work ...
        close(ch) // PANIC: close of closed channel
    }()
}

// GOOD: use sync.Once or a separate coordination goroutine
var closeOnce sync.Once
closeOnce.Do(func() { close(ch) })
```

### 3. Nil Channels

A nil channel blocks forever on read or write. This is useful for disabling select cases:

```go
var ch chan int

select {
case <-ch: // blocks forever if ch is nil
}
```

But it can also be intentional:

```go
// Disable a channel after draining it
ch := make(chan int)
go func() {
    for v := range ch {
        fmt.Println(v)
    }
}()
ch <- 1
close(ch)
ch = nil // now both read and write block
```

## Benchmark: Goroutines vs OS Threads

```
Operation               Time per op
Create goroutine         ~200ns
Create OS thread         ~2µs
Channel send/recv        ~50ns
Mutex lock/unlock        ~25ns
```

## Summary

| Pattern | When to Use |
|---------|-------------|
| WaitGroup | One-shot parallel work |
| Channels + select | Streaming data, coordination |
| Context | Cancellation, deadlines |
| sync.Mutex | Protecting shared state (rare) |
| sync.Map | High-contention read-heavy maps |

Go's concurrency model isn't just about performance — it's about clarity. Channels make data flow explicit, select enables composable timeouts, and goroutines make concurrency affordable enough to use wherever it improves structure.
