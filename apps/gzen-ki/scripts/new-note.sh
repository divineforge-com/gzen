#!/usr/bin/env bash
# Usage: ./scripts/new-note.sh <section> <slug> [title]
# Sections: notes, qixue, piwei, bencao, shiliao
# slug: short ASCII identifier, e.g. qi-xue-gailan
# title: optional Chinese title (defaults to slug if omitted)
#
# Examples:
#   bash scripts/new-note.sh notes zhongyi-gailan "中医基础概论"
#   bash scripts/new-note.sh qixue qi-xu-zheng "气虚证调养"
set -euo pipefail

SECTION="${1:-notes}"
SLUG="${2:-new-note}"
TITLE="${3:-${SLUG}}"
DATE=$(date +%Y-%m-%d)
FILE="content/${SECTION}/${DATE}-${SLUG}.md"

cat > "$FILE" << FRONTMATTER
---
title: "${TITLE}"
ja: ""
en: ""
date: "${DATE}"
tags: ["中医"]
description: "一句话简介。"
---

## 概述

核心要点一段话总结。

## 详细内容

### 小节一

内容...

### 小节二

内容...

## 调理建议

| 维度 | 建议 |
|------|------|
| 饮食 | ... |
| 运动 | ... |
| 中药 | ... |

## 参考资料

- 来源一
- 来源二
FRONTMATTER

echo "已创建：${FILE}"
