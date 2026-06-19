# Product Spec

## Product Vision

devdevbuilds Ghost Brain is a local-first visual memory interface for creative and technical work stored in an Obsidian-style Markdown vault. It makes a vault feel like a living 3D neural map where source, project, type, and relationship are visible at a glance.

The product should help a user move from scattered notes and AI sessions to a navigable memory system without replacing Obsidian as the authoring environment.

## Target Users

- Builders who use AI tools across planning, coding, writing, research, and visual generation.
- Obsidian users who want a richer spatial view of their vault.
- Solo founders and developers tracking many project threads.
- Creative technologists collecting prompts, assets, sessions, and strategy notes.
- Researchers who need provenance-aware notes across multiple tools.

## Key Use Cases

- See all notes connected to a project, grouped by source and note type.
- Trace where an idea came from and which sessions expanded it.
- Compare AI-generated notes with manual notes and repository artifacts.
- Find orphaned notes, unknown-source notes, duplicate prompts, stale sessions, or missing frontmatter.
- Explore a vault through a 3D graph instead of only a folder tree.
- Prepare project dashboards from Markdown notes without changing the vault format.

## MVP Scope

The MVP should establish a local prototype foundation:

- Define the source-aware data model.
- Define folder and frontmatter conventions.
- Provide sample vault notes for each supported source family.
- Produce static graph data in a later phase.
- Build toward a local 3D viewer in a later phase.

## Non-Goals

- Do not build the full dream engine yet.
- Do not build an Obsidian plugin yet.
- Do not require cloud storage or hosted sync.
- Do not introduce unnecessary dependencies before the parser and viewer choices are clear.
- Do not replace Obsidian as the main Markdown editing environment.
- Do not attempt automatic semantic truth validation in the first prototype.

