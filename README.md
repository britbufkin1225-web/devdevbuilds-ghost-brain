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

## MVP Goal

The MVP is a local web prototype foundation with documentation, source-aware data rules, and sample vault content. It does not yet include the full parser, 3D frontend, Obsidian plugin, or dream engine.

The first working milestone is a static graph JSON prototype generated from a small Obsidian-style vault, followed by a 3D viewer that can filter by source, project, type, status, and relationship.

## Future Roadmap

Ghost Brain is expected to evolve through these major phases:

1. Documentation and sample vault
2. Static graph JSON
3. 3D viewer
4. Markdown vault parser
5. Cleanup reports
6. Obsidian integration
7. Dream engine experiments

## Current Project Status

Status: Phase 1 foundation.

This repository currently focuses on clean architecture, product documentation, sample source metadata, and a source-aware vault layout. No unnecessary dependencies have been added.

