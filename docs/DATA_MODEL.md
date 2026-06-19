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

`Source` describes the specific origin of a note or artifact. Phase 4 should treat these values as default registry ids, not a closed permanent list. User-added sources should also use stable ids.

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

## SourceCategory Type

`SourceCategory` describes the broad kind of tool or content source represented by a registry entry.

```ts
type SourceCategory =
  | "llm"
  | "code"
  | "image"
  | "music"
  | "video"
  | "audio"
  | "research"
  | "local"
  | "manual"
  | "unknown";
```

## SourceRegistryEntry Shape

Phase 4 introduces a registry-backed source identity model.

```ts
type SourceRegistryEntry = {
  id: string;
  label: string;
  family: string;
  category: SourceCategory;
  color: string;
  enabled: boolean;
  aliases: string[];
};
```

Registry examples:

```json
{
  "id": "chatgpt",
  "label": "ChatGPT",
  "family": "openai",
  "category": "llm",
  "color": "#2f80ff",
  "enabled": true,
  "aliases": ["chatgpt", "openai-chatgpt", "gpt"]
}
```

```json
{
  "id": "suno",
  "label": "Suno",
  "family": "suno",
  "category": "music",
  "color": "#ffcc33",
  "enabled": true,
  "aliases": ["suno", "suno-ai"]
}
```

Graph nodes should reference source ids. Source labels, colors, families, categories, aliases, and enabled/disabled state should come from the registry. This keeps graph data stable while allowing the GUI to add new sources as the user's tool stack changes.

## SourceConfidence Type

`SourceConfidence` describes how the parser assigned source provenance.

```ts
type SourceConfidence =
  | "explicit"
  | "folder-inferred"
  | "content-inferred"
  | "unknown";
```

## Optional Model Metadata

Phase 4 should allow model metadata without requiring it for every note.

```ts
type ModelMetadata = {
  model?: string;
  modelFamily?: string;
  modelProvider?: SourceFamily | string;
  sourceUrl?: string;
  sourceConfidence: SourceConfidence;
};
```

Model metadata should supplement source identity, not replace it. A note can have a known source and an unknown model.

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
  type: NoteType;
  source: Source | string;
  sourceFamily: SourceFamily;
  sourceConfidence?: SourceConfidence;
  model?: string;
  modelFamily?: string;
  modelProvider?: string;
  project: string;
  status: string;
  path: string;
  tags: string[];
  dateCreated: string;
  linkCount: number;
};
```

## GraphEdge Shape

```ts
type GraphEdge = {
  id: string;
  source: string;
  target: string;
  targetTitle: string;
  type: "wikilink";
  resolved: boolean;
};
```

## graph.json Format

Phase 2 generates `data/graph.json` from Markdown files in `examples/sample-vault`.

Top-level shape:

```json
{
  "generatedAt": "2026-06-19T00:00:00.000Z",
  "summary": {
    "nodeCount": 0,
    "edgeCount": 0,
    "sourceCount": 0,
    "projectCount": 0,
    "typeCount": 0
  },
  "sourceGroups": [],
  "projects": [],
  "types": [],
  "nodes": [],
  "edges": []
}
```

`sourceGroups` contains source metadata used by the future 3D viewer:

```json
{
  "source": "chatgpt",
  "sourceFamily": "openai",
  "color": "#2f80ff",
  "count": 1
}
```

`projects` and `types` are count summaries:

```json
{
  "name": "devdevbuilds Ghost Brain",
  "count": 10
}
```

Each node represents one Markdown note:

```json
{
  "id": "chatgpt-planning-session-ghost-brain-mvp",
  "title": "ChatGPT Planning Session - Ghost Brain MVP",
  "type": "planning-session",
  "source": "chatgpt",
  "sourceFamily": "openai",
  "project": "devdevbuilds Ghost Brain",
  "status": "active",
  "path": "examples/sample-vault/sources/chatgpt/chatgpt-planning-session.md",
  "tags": ["ghost-brain", "planning", "mvp"],
  "dateCreated": "2026-06-19",
  "linkCount": 2
}
```

Each edge represents one Obsidian wiki link:

```json
{
  "id": "source-node-id-target-node-id",
  "source": "source-node-id",
  "target": "target-node-id",
  "targetTitle": "Original Linked Title",
  "type": "wikilink",
  "resolved": true
}
```

Unresolved links keep their original `targetTitle`, use a slugified target id, and set `resolved` to `false`.

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
model: gpt-5
model_family: gpt
model_provider: openai
source_url: https://example.com/original-artifact
source_confidence: explicit
```

See `docs/SOURCE_MODEL_REGISTRY.md` for the Phase 4 registry contract.

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
