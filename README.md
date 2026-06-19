# devdevbuilds Ghost Brain

devdevbuilds Ghost Brain is a source-aware 3D Obsidian memory interface. It reads an Obsidian-style Markdown vault and turns folders, files, links, tags, prompts, sessions, repositories, and visual assets into an interactive neural graph.

Obsidian remains the storage and authoring layer. Ghost Brain is the custom visual brain layer: a local web prototype that helps you see where knowledge came from, how it relates to projects, and what needs cleanup.

## Problem It Solves

Modern creative and engineering work is scattered across many AI systems, repos, prompts, research notes, and manual project notes. A normal folder tree can store those files, but it does not make source, context, duplication, relationships, or project state easy to see.

Ghost Brain is designed to answer questions like:

- Which ideas came from ChatGPT, Codex, Claude, Gemini, Midjourney, local LLMs, GitHub, or manual notes?
- Which files belong to a specific project?
- Which prompts, build sessions, research notes, and repo notes are connected?
- Which notes are missing source metadata or need cleanup?
- Which areas of the vault are dense, isolated, stale, or expanding?

## Supported Sources

Initial source groups:

- ChatGPT
- Codex
- Gemini
- Claude
- Claude Code
- Midjourney
- Local LLMs, starting with Ollama
- GitHub
- Manual notes
- Unknown source fallback

Ghost Brain is designed to expand beyond this default list. Future registry entries can represent regular LLMs, code tools, image tools, music tools, video tools, audio tools, research tools, local LLMs, manual notes, and unknown sources.

## MVP Goal

The MVP is a local web prototype foundation with documentation, source-aware data rules, and sample vault content. It does not yet include the full parser, 3D frontend, Obsidian plugin, or dream engine.

The first working milestone is a static graph JSON prototype generated from a small Obsidian-style vault, followed by a 3D viewer that can filter by source, project, type, status, and relationship.

## Phase 2 Graph Generator

Phase 2 adds a lightweight Node.js/TypeScript graph generator. It reads Markdown files recursively from `examples/sample-vault`, parses YAML frontmatter, extracts Obsidian-style wiki links, and writes graph data to `data/graph.json`.

The generated graph includes:

- Source-aware note nodes
- Wikilink edges
- Source group metadata and colors
- Project and note type summaries
- Resolved and unresolved link targets

## Install Dependencies

Use Node.js 24 or newer.

```sh
npm install
```

## Generate Graph Data

```sh
npm run build:graph
```

This writes:

```text
data/graph.json
public/data/graph.json
```

The `public/data/graph.json` copy is served by Vite at `/data/graph.json` for the local 3D viewer.

## Check the Project

```sh
npm run check
```

The current check script runs the graph build and fails if parsing or generation fails.

## Run the 3D Viewer

```sh
npm run dev
```

The Vite dev server starts the local Phase 3 viewer. It fetches graph data from `/data/graph.json`, renders notes as source-colored 3D memory nodes, renders wikilinks as synaptic edges, and provides source/project/type filters.

Production build:

```sh
npm run build
```

Preview a production build:

```sh
npm run preview
```

## Current Viewer Features

- 3D graph rendered from `/data/graph.json`
- Nodes colored by source
- Node sizing by note type
- Subtle glowing synaptic links
- Hover card with title, source, project, type, tags, and path
- Click-to-select detail panel with full metadata
- Left sidebar filters for source, category, project, and note type
- Sources & Models panel for local registry management
- Top mode buttons for Global, Source, Project, Cleanup, and Dream views
- Cleanup and Dream views are placeholders in Phase 3

## Phase 4A Source + Model Registry

Phase 4A adds an expandable Source + Model Registry so users can add new AI tools and model sources through the GUI.

Current Phase 4A behavior:

- Open the Sources & Models panel from the top command bar.
- Let users create source entries with name, id, category, description, color, and enabled state.
- Edit, enable/disable, and delete custom entries.
- Store user-added sources in `localStorage` under `obsidianBrain.sourceRegistry`.
- Store active source/category filters under `obsidianBrain.activeSourceFilters`.
- Support import/export of registry JSON.
- Resolve graph node labels, colors, and categories through the registry when a source id matches.
- Fall back cleanly for unregistered graph source ids.

Phase 4A persistence is local to the current browser profile. Clearing site data or switching browsers removes local custom registry entries unless they are exported first.

Future Phase 4B behavior:

- Persist the registry through a future backend, companion config file, or Obsidian plugin integration.
- Keep a portable JSON shape that can later live at `config/source-registry.json`.

## Future Roadmap

Ghost Brain is expected to evolve through these major phases:

1. Documentation and sample vault
2. Static graph JSON
3. 3D viewer
4. Expandable Source + Model Registry
5. Markdown vault parser
6. Cleanup reports
7. Obsidian integration
8. Dream engine experiments

## Current Project Status

Status: Phase 4A local Source + Model Registry prototype.

This repository currently includes clean architecture docs, sample source metadata, a source-aware vault layout, generated graph data, the first interactive local 3D viewer, and a localStorage-backed registry GUI.

The next phase should harden registry persistence and parser integration without building the dream engine or Obsidian plugin yet.
