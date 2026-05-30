# Architecture and Design Decisions

## ADR 1: Feedback and Decision Mechanism

**Date**: 2026-05-30
**Status**: Accepted

### Context
Need a systematic way to track feedback and record design decisions for the GrowZen site.

### Decision
Implemented a lightweight, text-based ADR (Architecture Decision Record) and Feedback logging system using markdown files.

### Consequences
Better traceability of why decisions were made and what feedback drove them. Requires discipline to use consistently.

---
## ADR 2: Open Graph Image Generation

**Date**: 2026-05-30
**Status**: Accepted

### Context
The site lacks a good Open Graph preview image when shared, reducing click-through rates and not reflecting the site's aesthetic.

### Decision
Created a script to generate a static Open Graph image using Pillow with the site's warm color palette and branding, and updated hugo.toml to use it.

### Consequences
Improved social sharing appearance. The image is currently static, so it won't dynamically update per-post unless further extended, but it provides a solid default.

---
## ADR 3: Feature Images for Content

**Date**: 2026-05-30
**Status**: Accepted

### Context
To ensure every post has an Open Graph image, we need a way to assign the generated images to individual posts.

### Decision
Wrote a python script to iterate over markdown files and append 'feature: img/<filename>.jpg' to the frontmatter.

### Consequences
Makes posts visually distinct when shared, rather than using the fallback image.

---

## ADR 3: divineforge Submodule Integration Strategy

**Date**: 2026-05-30
**Status**: Accepted

### Context
The `divineforge/divineforge` repository contains context like STACKy bots which could help AI agents building the site to the next level. However, since it is a private repository, it cannot be added as a submodule using standard `https` clone commands in a CI/agent environment without proper authentication.

### Decision
Developers should add the submodule locally using their SSH keys rather than attempting to script the addition in the agent sandbox.

Run the following command locally:
`git submodule add git@github.com:divineforge/divineforge.git divineforge`

### Consequences
- Secures the integration by relying on local developer authentication.
- Agents or CI pipelines that need access to the submodule will either need SSH keys configured via secrets, or they will skip the submodule initialization if they don't explicitly require its context for generating the public site build.
---
