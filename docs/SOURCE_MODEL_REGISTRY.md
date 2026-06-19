# Source and Model Registry

Phase 4 should introduce an expandable source/model registry before expanding the vault parser. The registry is the canonical place where Ghost Brain knows which tools, model families, categories, aliases, colors, folder names, and detection rules belong together.

This document is a design contract only. It does not require implementation yet.

## Purpose

The registry should prevent source logic from spreading across parser code, graph generation, UI filters, cleanup checks, and future integrations.

It should answer:

- Which source values are valid?
- Which source family owns each source?
- Which display label and color should the UI use?
- Which folder names, aliases, frontmatter values, or export markers identify a source?
- Which models are associated with a source?
- Which source/model combinations should be flagged for cleanup?
- Which user-added sources are enabled?
- Which broad category does a source belong to?

## Registry Responsibilities

- Define supported `source` values.
- Define supported `source_family` values.
- Define source categories.
- Map each source to display metadata.
- Map each source to folder/path aliases.
- Map each source to known model identifiers.
- Provide fallback behavior for unknown sources and models.
- Give cleanup checks a single validation reference.
- Give the 3D viewer a stable source/color identity system.

## Phase 4A and 4B

Phase 4A should create a GUI registry prototype in the local viewer. It should store user-added entries in `localStorage` and support import/export as JSON.

Phase 4B should persist the same registry through a future backend, companion config file, or Obsidian plugin integration. The likely file target is `config/source-registry.json`.

The JSON shape should remain portable between Phase 4A and Phase 4B.

## Proposed Registry Shape

```ts
type SourceModelRegistryEntry = {
  id: string;
  label: string;
  family: string;
  category: SourceCategory;
  color: string;
  enabled: boolean;
  aliases: string[];
  folderAliases: string[];
  frontmatterAliases: string[];
  modelAliases: string[];
  detectionHints: string[];
  defaultNoteTypes: NoteType[];
  cleanupPriority: "normal" | "review" | "high";
};
```

Example:

```ts
{
  id: "chatgpt",
  label: "ChatGPT",
  family: "openai",
  category: "llm",
  color: "#2f80ff",
  enabled: true,
  aliases: ["chatgpt", "openai-chatgpt", "gpt"],
  folderAliases: ["chatgpt", "openai/chatgpt"],
  frontmatterAliases: ["chatgpt", "gpt", "openai-chatgpt"],
  modelAliases: ["gpt-4o", "gpt-4.1", "gpt-5"],
  detectionHints: ["ChatGPT", "OpenAI"],
  defaultNoteTypes: ["planning-session", "strategy-session"],
  cleanupPriority: "normal"
}
```

## Source Categories

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

Categories are broad grouping labels. They should help users filter and organize tools without erasing the specific source id.

## Supported Sources

| Source | Source family | Label | Phase 4 role |
| --- | --- | --- | --- |
| `chatgpt` | `openai` | ChatGPT | Conversational planning, reasoning, writing, and analysis |
| `codex` | `openai` | Codex | Coding sessions, implementation logs, code review, and agentic builds |
| `claude` | `anthropic` | Claude | Writing, strategy, analysis, and long-form synthesis |
| `claude-code` | `anthropic` | Claude Code | Agentic coding sessions and repo automation |
| `gemini` | `google` | Gemini | Research, analysis, and multimodal notes |
| `midjourney` | `midjourney` | Midjourney | Image prompts, visual concepts, and generation runs |
| `ollama` | `local` | Ollama | Local LLM sessions and private/offline model notes |
| `github` | `github` | GitHub | Repositories, issues, PRs, releases, commits, and project artifacts |
| `manual` | `manual` | Manual | Human-authored notes and project documents |
| `unknown` | `unknown` | Unknown | Fallback bucket for missing or untrusted provenance |

## Future Source Examples

The registry should be able to add future sources without code changes:

| Example source | Category | Example family/provider |
| --- | --- | --- |
| Suno | `music` | `suno` |
| Udio | `music` | `udio` |
| Stable Diffusion | `image` | `stability` or `local` |
| Runway | `video` | `runway` |
| LM Studio | `local` | `local` |
| GitHub Copilot | `code` | `github` |
| Perplexity | `research` | `perplexity` |

## Model Metadata

Phase 4 should support optional model metadata without requiring every note to have it.

Recommended optional frontmatter:

```yaml
model: gpt-5
model_family: gpt
model_provider: openai
source_url: https://example.com/original-artifact
source_confidence: explicit
```

`source_confidence` should describe how provenance was assigned:

```ts
type SourceConfidence = "explicit" | "folder-inferred" | "content-inferred" | "unknown";
```

The parser should treat explicit frontmatter as strongest, folder inference as useful, content inference as weak, and unknown as a cleanup target.

## Detection Order

Phase 4 detection should use this order:

1. Valid explicit `source` and `source_family` frontmatter.
2. Registry `frontmatterAliases`.
3. Registry `folderAliases`.
4. Registry `modelAliases`.
5. Registry `detectionHints` from note body or export metadata.
6. `unknown` fallback.

Every inferred value should be marked with source confidence so Cleanup View can explain why a note was classified.

## Validation Rules

The parser should report, not silently repair:

- Unknown `source` values.
- Unknown `source_family` values.
- Mismatched source/source family pairs.
- Known model aliases attached to the wrong source family.
- Missing source metadata.
- Weak content-inferred source assignments.
- Notes where source and folder disagree.

## Unknown Model Fallback

Unknown models should not force the whole note into `source: unknown` when source provenance is otherwise clear.

Example:

- `source: chatgpt`
- `source_family: openai`
- `model: unknown`

This should remain a ChatGPT/OpenAI note with a model cleanup warning.

## Implementation Boundaries

Phase 4 should add the expandable registry contract and GUI management flow before parser expansion. It should not add:

- Dream engine behavior
- Full cleanup automation
- Obsidian plugin behavior
- Cloud sync
- Provider API calls

Parser integration should happen after the registry shape is stable enough to validate real vault files.
