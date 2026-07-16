# 元気・健康笔记 (gzen-ki)

**[元気・健康笔记 — genki.gzen.io](https://genki.gzen.io)** 是一个以中医为本的健康知识数码笔记本，聚焦气血调和、脾胃健康、本草药膳与中西医结合养生。

以中文为主，附日文翻译，最后加上英文注解。图文并茂，部分笔记配合 Excalidraw 图解。

A **[GZen](https://gzen.io)** product, built by **[Divineforge Technology Enterprise](https://divineforge.com)**.

---

## 设计决策 / Design Decisions

### 1. Hugo 静态网站
采用 [Hugo](https://gohugo.io/) 构建，全部内容以 Markdown + YAML frontmatter 撰写。Hugo 构建速度极快（<100ms），部署至 GitHub Pages，无需服务器基础设施。

### 2. 暖玉色主题 / Warm Jade Theme
自定义 CSS 主题，采用：
- **深玉绿导航栏**（`#1a3a28`）—— 沉稳健康色调
- **暖米白背景**（`#fdfaf5`）—— 如宣纸般温润
- **玉绿强调色**（`#2d6b4f`）—— 自然生命感
- **Noto Serif SC** 字体 —— 优雅的中文衬线字体，适合长文阅读
- 移动端优先，640px / 860px 断点

### 3. 三语结构
每篇笔记支持三语 frontmatter：
```yaml
title: "气血理论"     # 中文（主）
ja: "気血理論"        # 日文（次）
en: "Qi and Blood Theory"  # 英文（末）
```

### 4. Excalidraw 图解
提供 `excalidraw` shortcode，支持两种模式：
- **图片模式**（默认）：嵌入本地 SVG/PNG 导出图
- **嵌入模式**：嵌入 Excalidraw 在线分享 URL 的 iframe

```
{{< excalidraw src="/diagrams/qi-xue.svg" alt="气血关系图" caption="气与血的相互关系" >}}
{{< excalidraw src="https://excalidraw.com/#..." type="embed" caption="脾胃运化示意" >}}
```

### 5. 客户端全文搜索
搜索无需后端，通过 Hugo JSON 输出实现：
- 构建时生成 `index.json`，包含每页的标题、URL、摘要、标签与分区
- `/search/` 页面在浏览器端做关键词匹配（支持中文关键词）
- 支持 `?q=` URL 参数实现可分享搜索链接
- 输入防抖（200ms）

### 6. 知识分区结构
导航以**内容分区**驱动，辅以标签：

| 分区 | 日文 | 内容 |
|------|------|------|
| `/notes/` | ノート | 综合中医笔记、中西医结合 |
| `/qixue/` | 気血 | 气血理论、阴阳平衡 |
| `/piwei/` | 脾胃 | 脾胃功能、消化调理 |
| `/bencao/` | 本草 | 中药材性味归经功效 |
| `/shiliao/` | 食療 | 药膳食疗、以食养生 |

### 7. Logo — 元 (Yuán)
导航栏 Logo 使用汉字**「元」**（源自元气/元氣，日文 Genki），呈现为白色字符配玉绿方块，象征生命活力之源。

---

## 内容结构 / Content Structure

```
content/
├── notes/           # 综合中医笔记、中西医结合资料
├── qixue/           # 气血理论与调养
├── piwei/           # 脾胃健康与调理
├── bencao/          # 本草中药知识
├── shiliao/         # 食疗药膳
├── search.md        # 搜索页
└── _index.md        # 首页
```

---

## 开发指南 / Development

```bash
# 安装 Hugo extended ≥ 0.147.7
# https://gohugo.io/installation/

# 本地开发服务器（热重载）
hugo server

# 生产构建
hugo --minify
```

输出至 `public/`（已 gitignore）。推送至 `main` 分支后自动部署（GitHub Actions）。

---

## 新建笔记 / Creating Notes

```bash
# 新建笔记（指定分区和标题）
bash scripts/new-note.sh notes "笔记标题"
bash scripts/new-note.sh qixue "气虚体质调养"
bash scripts/new-note.sh piwei "脾胃保养日常"
bash scripts/new-note.sh bencao "黄芪功效详解"
bash scripts/new-note.sh shiliao "红枣枸杞粥"
```

手动创建时，frontmatter 格式：

```yaml
---
title: "气血理论：人体生命的根本动力"
ja: "気血理論：生命の根本的な動力"
en: "Qi and Blood Theory: The Fundamental Force of Life"
date: 2026-04-04
tags: ["气血", "基础理论"]
description: "一句话简介。"
---
```

