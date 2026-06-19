# Architecture

Ghost Brain is organized as layered local tooling around an Obsidian-style Markdown vault.

## Vault Layer

The vault layer is the source of truth. It contains Markdown files, folders, links, tags, frontmatter, prompts, session notes, repo notes, image prompts, and project notes.

The vault should remain readable and useful in Obsidian even when Ghost Brain is not running.

## Parser and Index Layer

The parser/index layer will read Markdown files and extract:

- YAML frontmatter
- Markdown headings
- Wiki links
- Markdown links
- Tags
- Embedded assets
- Folder paths
- Source metadata
- Project metadata

The first parser should be conservative and file-based. It should report missing or ambiguous metadata instead of guessing silently.

Phase 4 should introduce a source/model registry before adding broader parser behavior. The registry becomes the app and parser authority for valid sources, source families, source categories, source colors, aliases, model aliases, and source confidence. Phase 4A should expose this through a local GUI backed by `localStorage` and import/export JSON. Parser logic should later ask the registry how to classify a note instead of hardcoding source rules in multiple places.

## Graph Data Layer

The graph data layer converts indexed vault content into graph-ready data:

- Files become graph nodes.
- Folders become cluster nodes or grouping metadata.
- Links become graph edges.
- Shared tags, projects, and sources can create derived edges.
- Source family and source values drive colors and grouping.

The first output target is static JSON in `data/`.

## 3D UI Layer

The 3D UI layer will render the graph as an interactive neural interface. It should support source-aware colors, project filtering, hover cards, selected-node detail, and multiple view modes.

This layer is not part of Phase 1. The initial architecture prepares for it without committing to a frontend framework too early.

## Cleanup Layer

The cleanup layer will inspect the vault and graph data for problems:

- Missing frontmatter fields
- Unknown sources
- Invalid source/source family combinations
- Broken links
- Orphaned notes
- Duplicate titles
- Stale project statuses
- Notes without project or tags
- Unknown or mismatched model metadata
- Weak source confidence, such as content-inferred provenance

Reports should be written to `reports/`.

## Future Dream Engine Layer

The future dream engine layer may generate speculative connections, expansion prompts, project next steps, concept maps, or memory resurfacing ideas.

This layer is intentionally out of scope for the MVP. The current project should preserve room for it without building it prematurely.
