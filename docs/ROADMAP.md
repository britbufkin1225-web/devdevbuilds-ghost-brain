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
- Initial implementation uses Vite, React, TypeScript, Three.js, and `react-force-graph-3d`.
- Cleanup View and Dream View remain placeholders during this phase.

## Phase 4: Expandable Source + Model Registry

- Make Ghost Brain expandable for new AI tools, model providers, and source categories.
- Replace permanently fixed source assumptions with a registry-backed source identity system.
- Define built-in defaults for ChatGPT, Codex, Claude, Claude Code, Gemini, Midjourney, Ollama, GitHub, Manual, and Unknown.
- Support source categories: LLM, Code, Image, Music, Video, Audio, Research, Local, Manual, and Unknown.
- Let graph nodes reference source ids while display metadata comes from the registry.

### Phase 4A: GUI Registry Prototype

- Add a Sources & Models panel to the local viewer.
- Let users add, edit, enable, disable, and color source/model entries.
- Store user-added registry entries in `localStorage`.
- Support import/export of registry JSON.
- Keep the prototype local and dependency-light.

### Phase 4B: Persistent Registry

- Persist registry data through a future backend, companion config file, or Obsidian plugin integration.
- Target a future config path such as `config/source-registry.json`.
- Preserve import/export JSON compatibility from Phase 4A.
- Keep registry data portable between the local web app and future Obsidian integration.

## Phase 5: Markdown Vault Parser

- Use the source/model registry before expanding parser behavior.
- Parse Markdown files from a vault path.
- Extract frontmatter, tags, links, folders, and assets.
- Generate graph JSON automatically.
- Validate source, source family, model, and source confidence against the registry.
- Preserve Obsidian compatibility.

## Phase 6: Cleanup Report

- Detect missing frontmatter.
- Detect invalid source metadata.
- Detect broken links and orphan notes.
- Write reports to `reports/`.

## Phase 7: Obsidian Integration

- Explore Obsidian integration after the local prototype is useful.
- Decide whether integration should be a plugin, command export flow, or companion app bridge.
- Avoid coupling the core parser and graph model directly to Obsidian internals.

## Phase 8: Dream Engine

- Experiment with generated connections, resurfaced memories, project expansion prompts, and speculative maps.
- Keep dream outputs separate from source-authored notes unless explicitly accepted by the user.
- Preserve provenance for all generated suggestions.
