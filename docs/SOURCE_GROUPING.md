# Source Grouping

Ghost Brain groups every file by `source` and `source_family`. Source grouping is a first-class behavior, not a cosmetic filter.

## Supported Source Groups

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
2. If frontmatter is missing, infer from a recognized source folder path.
3. If folder inference fails, inspect known filename prefixes only as a weak hint.
4. If the source still cannot be determined, assign `source: unknown` and `source_family: unknown`.
5. Record all inferred or unknown cases in cleanup reports.

## Unknown Source Fallback Behavior

Unknown files must still appear in the graph. They should be grouped into an Unknown cluster, colored with the unknown color, and prioritized in Cleanup View.

The parser should never discard a readable Markdown note only because source metadata is incomplete.

