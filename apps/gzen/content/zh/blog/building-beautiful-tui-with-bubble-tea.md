---
title: "使用 Bubble Tea 构建优雅的终端界面"
description: "使用 Go 语言的 Bubble Tea 框架和 Charm 生态构建交互式终端应用的实用指南。"
date: 2026-07-16
tags: ["tui", "bubble-tea", "charm", "cli"]
author: "GZen.io"
---

终端界面不必单调。[Bubble Tea](https://github.com/charmbracelet/bubbletea) 让你能够用 Go 语言构建丰富的交互式终端用户界面（TUI），采用优雅的 Elm 风格架构。

## 为什么选择 Bubble Tea？

Bubble Tea 带来了**函数式、声明式的模型**：

- **Model** — 应用状态
- **Update** — 根据消息返回新模型的函数
- **View** — 将模型渲染为字符串的函数

这种单向数据流让复杂终端应用的推理变得简单。

## 快速开始

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
        os.Exit(1)
    }
}
```

## Charm 生态

| 库 | 用途 |
|---------|---------|
| **Bubble Tea** | TUI 框架 |
| **Lip Gloss** | 样式 — 颜色、对齐、边距 |
| **Bubbles** | 预置组件 |
| **Glamour** | 终端中渲染 Markdown |

## 实用模式

定时器命令：

```go
func tickEvery() tea.Cmd {
    return tea.Every(time.Second, func(t time.Time) tea.Msg {
        return tickMsg(t)
    })
}
```

Bubble Tea 让终端成为画布。现在就去探索吧。
