# Roadmap

## Phase 1: Docs and Sample Vault

- Create product and architecture documentation.
- Define source-aware data model.
- Define source grouping rules.
- Create sample Obsidian-style vault notes.
- Keep the repository dependency-free.

## Phase 2: Static Graph JSON

- Add a hand-authored or generated graph JSON file in `data/`.
- Represent sample notes as graph nodes.
- Represent wiki links and project/source relationships as graph edges.
- Validate the basic data model against sample content.

## Phase 3: 3D Viewer

- Build a local web prototype.
- Render graph nodes and edges in 3D.
- Add source colors, hover cards, selection, and filters.
- Support Global View, Source View, Project View, Local View, and Cleanup View.

## Phase 4: Markdown Vault Parser

- Parse Markdown files from a vault path.
- Extract frontmatter, tags, links, folders, and assets.
- Generate graph JSON automatically.
- Preserve Obsidian compatibility.

## Phase 5: Cleanup Report

- Detect missing frontmatter.
- Detect invalid source metadata.
- Detect broken links and orphan notes.
- Write reports to `reports/`.

## Phase 6: Obsidian Integration

- Explore Obsidian integration after the local prototype is useful.
- Decide whether integration should be a plugin, command export flow, or companion app bridge.
- Avoid coupling the core parser and graph model directly to Obsidian internals.

## Phase 7: Dream Engine

- Experiment with generated connections, resurfaced memories, project expansion prompts, and speculative maps.
- Keep dream outputs separate from source-authored notes unless explicitly accepted by the user.
- Preserve provenance for all generated suggestions.

