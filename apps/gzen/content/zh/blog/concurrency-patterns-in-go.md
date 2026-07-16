---
title: "Go 并发模式：Goroutine、Channel 与 Select"
description: "深入 Go 的并发原语 —— goroutine 生命周期、channel 模式、select 语句和实际惯用法。"
date: 2026-07-16
tags: ["concurrency", "goroutines", "channels", "patterns"]
author: "GZen.io"
---

Go 的并发模型是其标志性特性之一。Goroutine 和 channel 让并发编程比线程加锁更易上手。

## Goroutine 轻量级

Goroutine 由 Go 运行时管理，初始栈仅约 4KB：

```go
var wg sync.WaitGroup
for i := 0; i < 10000; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        // ... 处理 ...
    }(i)
}
wg.Wait()
```

## Channel 模式

### 扇出/扇入

```go
func fanOut[T any](in <-chan T, workers int) []<-chan T { ... }
func fanIn[T any](chs ...<-chan T) <-chan T { ... }
```

### Pipeline 模式

```go
func generate(nums ...int) <-chan int { ... }
func square(in <-chan int) <-chan int { ... }
```

## Select 语句

### 限速器

```go
select {
case <-ticker.C:
    return nil
case <-ctx.Done():
    return ctx.Err()
}
```

### 最快响应优先

```go
select {
case resp := <-ch:
    return resp, nil
case <-ctx.Done():
    return nil, ctx.Err()
}
```

## 常见错误

1. **Goroutine 泄漏** — 无接收者的无缓冲 channel 发送会永久阻塞
2. **关闭已关闭的 channel** — 只有发送者应关闭 channel
3. **Nil channel** — 读写 nil channel 会永久阻塞

## 总结

Go 的并发模型关乎清晰度。Channel 让数据流变得显式，select 让超时变得可组合，goroutine 让并发廉价到随处可用。
