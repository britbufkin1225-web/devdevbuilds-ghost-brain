# Data Model

## SourceFamily Type

`SourceFamily` describes the parent ecosystem for a source.

```ts
type SourceFamily =
  | "openai"
  | "anthropic"
  | "google"
  | "midjourney"
  | "local"
  | "github"
  | "manual"
  | "unknown";
```

## Source Type

`Source` describes the specific origin of a note or artifact.

```ts
type Source =
  | "chatgpt"
  | "codex"
  | "claude"
  | "claude-code"
  | "gemini"
  | "midjourney"
  | "ollama"
  | "github"
  | "manual"
  | "unknown";
```

## NoteType Type

`NoteType` describes the role of a note in the vault.

```ts
type NoteType =
  | "planning-session"
  | "build-session"
  | "strategy-session"
  | "agent-session"
  | "research-note"
  | "prompt-note"
  | "local-llm-note"
  | "repo-note"
  | "project-note"
  | "unknown-note";
```

## GraphNode Shape

```ts
type GraphNode = {
  id: string;
  title: string;
  type: NoteType | "folder" | "asset";
  source: Source;
  source_family: SourceFamily;
  project: string;
  status: string;
  path: string;
  tags: string[];
  date_created: string;
  folder?: string;
  summary?: string;
};
```

## GraphEdge Shape

```ts
type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: "wikilink" | "markdown-link" | "tag" | "project" | "source" | "folder";
  label?: string;
  weight?: number;
};
```

## Frontmatter Requirements

Every Markdown note intended for Ghost Brain indexing should include:

```yaml
title: string
type: NoteType
source: Source
source_family: SourceFamily
project: string
status: string
date_created: YYYY-MM-DD
tags:
  - tag
```

Recommended optional fields:

```yaml
aliases:
  - Alternate name
related:
  - Another note title
asset_paths:
  - relative/path/to/asset.png
```

## Example Markdown Note

```md
---
title: Ghost Brain MVP Plan
type: planning-session
source: chatgpt
source_family: openai
project: devdevbuilds Ghost Brain
status: active
date_created: 2026-06-19
tags:
  - ghost-brain
  - planning
  - mvp
---

# Ghost Brain MVP Plan

This note captures an early planning session for the Ghost Brain prototype.

Related notes:

- [[Codex Build Session - Static Graph Foundation]]
- [[Manual Project Note - Ghost Brain Overview]]
```

