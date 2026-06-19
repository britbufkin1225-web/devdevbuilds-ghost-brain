# Source Grouping

Ghost Brain groups every file by source identity. Source grouping is a first-class behavior, not a cosmetic filter.

Phase 4 should move source definitions, source colors, aliases, model mappings, and detection hints into the source/model registry described in `docs/SOURCE_MODEL_REGISTRY.md`.

Source groups should no longer be treated as permanently fixed. The default groups provide a useful starting set, but the user must be able to add new sources and models through the GUI as their AI tool stack changes.

## Default Built-In Sources

| Source | Source family | Description |
| --- | --- | --- |
| `chatgpt` | `openai` | ChatGPT planning, writing, reasoning, and conversational sessions |
| `codex` | `openai` | Codex build, code review, and implementation sessions |
| `claude` | `anthropic` | Claude writing, strategy, and analysis sessions |
| `claude-code` | `anthropic` | Claude Code agent and coding sessions |
| `gemini` | `google` | Gemini research and analysis notes |
| `midjourney` | `midjourney` | Midjourney prompts, image runs, and visual concepts |
| `ollama` | `local` | Local LLM sessions, starting with Ollama |
| `github` | `github` | Repository, issue, PR, release, and commit notes |
| `manual` | `manual` | Human-authored notes without an AI or external tool source |
| `unknown` | `unknown` | Fallback for unclassified or missing-source files |

These built-ins should ship enabled by default:

- ChatGPT
- Codex
- Claude
- Claude Code
- Gemini
- Midjourney
- Ollama
- GitHub
- Manual
- Unknown

## Future Source Examples

Future user-added registry entries may include:

- Suno for music generation.
- Udio for music generation.
- Stable Diffusion for image generation.
- Runway for video generation.
- LM Studio for local LLM work.
- GitHub Copilot for code assistance.
- Perplexity for research.

## Source Categories

Every registry source should belong to one category:

| Category | Purpose |
| --- | --- |
| `llm` | Regular conversational LLMs and assistant tools |
| `code` | Code models, coding agents, IDE assistants, and repo automation |
| `image` | Image models and visual generation tools |
| `music` | Music generation tools |
| `video` | Video generation and editing tools |
| `audio` | Voice, speech, sound, and audio processing tools |
| `research` | Search, research, citation, and knowledge-gathering tools |
| `local` | Local LLMs and locally hosted model tools |
| `manual` | Human-authored notes and manual project records |
| `unknown` | Missing, ambiguous, or untrusted provenance |
 
Categories are for grouping and filtering. They should not replace the specific source id.

## Folder Layout

The sample vault uses a source-first folder structure:

```text
examples/sample-vault/
  sources/
    chatgpt/
    codex/
    claude/
    claude-code/
    gemini/
    midjourney/
    ollama/
    github/
    manual/
    unknown/
```

Future vaults may add project-first dashboards, but source-first storage keeps provenance obvious.

## Source Color Map

Initial color values for the 3D graph:

| Source | Color |
| --- | --- |
| `chatgpt` | `#10A37F` |
| `codex` | `#3B82F6` |
| `claude` | `#D97706` |
| `claude-code` | `#B45309` |
| `gemini` | `#8B5CF6` |
| `midjourney` | `#EC4899` |
| `ollama` | `#22C55E` |
| `github` | `#6B7280` |
| `manual` | `#F59E0B` |
| `unknown` | `#94A3B8` |

## Source Detection Rules

Detection should prefer explicit metadata over inference:

1. Use `source` and `source_family` from YAML frontmatter when both are present and valid.
2. Check registry frontmatter aliases.
3. If frontmatter is missing, infer from a recognized registry folder alias.
4. If folder inference fails, inspect known model aliases.
5. If model aliases fail, inspect registry detection hints only as a weak content hint.
6. If the source still cannot be determined, assign `source: unknown` and `source_family: unknown`.
7. Record all inferred or unknown cases in cleanup reports.

Source detection should also assign `source_confidence`:

- `explicit` for valid frontmatter.
- `folder-inferred` for registry folder matches.
- `content-inferred` for weak body/export hints.
- `unknown` for fallback classification.

## Unknown Source Fallback Behavior

Unknown files must still appear in the graph. They should be grouped into an Unknown cluster, colored with the unknown color, and prioritized in Cleanup View.

The parser should never discard a readable Markdown note only because source metadata is incomplete.

If a note has a known category but unknown specific source, the registry should prefer a source id that communicates uncertainty, such as `unknown`, until the user adds or selects the correct source entry.
