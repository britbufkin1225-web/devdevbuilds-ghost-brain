# UI Spec

## 3D Neural Visual Metaphor

Ghost Brain should feel like a navigable memory space. The graph represents the vault as a neural structure where source, project, folder, and relationship affect layout and appearance.

The interface should prioritize clarity over spectacle. Motion, glow, depth, and clustering should help the user understand relationships.

Phase 3 implements the first viewer with Vite, React, TypeScript, Three.js, and `react-force-graph-3d`. It renders `data/graph.json` directly, with notes as 3D memory cells and wikilinks as synaptic links.

## Iridescent Surface Interaction System

The 3D interface should use a cyber-organic neural surface metaphor.

Core design principle: Ambient states glow. Focus states clarify.

### Resting / Surface State

- Nodes and major interface sections appear embedded in or resting on a dark neural brain surface.
- They should have soft iridescent emission.
- They should use subtle bloom, glow, shimmer, and slow breathing animation.
- The color treatment should feel like holographic glass, oil-slick iridescence, opal, or bioluminescent neural material.
- Avoid toy-like rainbow colors. Use controlled iridescence with cyan, violet, magenta, blue, teal, and occasional gold/green edge highlights.

### Hover / Rollover State

- When the cursor rolls over a node or interface section, the element should intensify its light-emitting effect.
- Bloom and glow should increase.
- The node or section should scale up slightly.
- Connected edges and nearby related nodes should softly illuminate.
- Hover should feel like signal activation, not a button gimmick.
- Recommended timing: 120-180ms.

### Selected / Focus State

- When selected, the node or interface section should pop outward from the neural surface toward the viewer.
- In this selected state, the object should reduce its diffuse emissive glow.
- It should become sharper, clearer, more opaque, and more readable.
- The selected item should not look dead; it should look extracted, focused, and physically separated from the brain surface.
- Use a crisp rim light or outline instead of heavy bloom.
- Recommended timing: 220-320ms.

### Return-to-Surface State

- When deselected, the selected item should animate back into the brain surface.
- Once returned, it should regain its soft iridescent emission, bloom, shimmer, and ambient breathing.
- The return should feel like the node is being reabsorbed into the cortex.
- Recommended timing: 260-360ms.

### UI Panel Behavior

- Left filter panel, right detail panel, and top mode buttons should follow the same visual language.
- Idle panel elements should have subtle iridescent edges.
- Hovered controls should brighten.
- Active/selected controls should appear slightly raised, sharper, and less diffuse.
- The right detail panel should inherit a faint tint from the selected node source color.

### Source Color Integration

- Source colors remain the primary identity system.
- Iridescence should layer on top of source color, not replace it.
- The selected node should retain its source identity through rim light, label color, or detail panel tint.

### Motion Language

- Motion should feel smooth, organic, and technical.
- Avoid exaggerated bounce or game-like animations.
- Use subtle easing.
- Ambient breathing should loop slowly, around 3-6 seconds.
- Hover reactions should be quick.
- Selection and return should be smooth and readable.

### Accessibility and Readability

- Text must remain readable over glow effects.
- Hover cards and detail panels should favor clarity over decoration.
- Selected/focused states should reduce visual noise.
- Filters and controls should remain usable even if bloom or shader effects are disabled.

### Implementation Note

This visual behavior should be implemented first with CSS transitions, node scaling, emissive material changes, and bloom-like styling where possible. Advanced shaders can be added later.

## Folders as Clusters

Folders appear as spatial clusters. A folder cluster can contain notes, assets, and subclusters. Source folders should be visually distinct from project folders.

## Files as Neurons

Markdown files appear as neurons. Size, color, and brightness can indicate source, type, status, recency, link density, or cleanup state.

## Links as Synapses

Wiki links, Markdown links, shared tags, shared projects, and derived relationships appear as synapses. Direct note links should be visually stronger than inferred relationships.

## Hover Card Behavior

Hovering a node should show a compact card with:

- Title
- Source and source family
- Note type
- Project
- Status
- Tags
- Path
- Short excerpt or summary when available

## Click and Select Behavior

Clicking a node selects it and opens a detail panel. The selected node should highlight its immediate neighbors and dim unrelated graph regions.

Expected detail panel actions:

- Open source Markdown path
- Show backlinks and outgoing links
- Show source metadata
- Show cleanup warnings
- Filter to local neighborhood

## Sidebar Filters

Sidebar filters should include:

- Source
- Source family
- Source category
- Project
- Note type
- Status
- Tags
- Date range
- Cleanup state

## Sources & Models Panel

Phase 4A adds a Sources & Models panel for managing the expandable registry. The current hardcoded source list becomes the default built-in registry, not the permanent limit of the system.

The GUI should allow users to add a new source/model entry with these fields:

- `name`: human-readable name, such as Suno or LM Studio.
- `id`: stable source id used by graph nodes, such as `suno` or `lm-studio`.
- `category`: one of LLM, Code, Image, Music, Video, Audio, Research, Local, Manual, or Unknown.
- `color`: source identity color used in graph nodes, filters, labels, and detail tinting.
- `description`: short explanation of the source/model.
- `enabled`: whether the source appears in filters and graph grouping.
- `createdAt` and `updatedAt`: ISO timestamps maintained by the app.

Phase 4A persists user-added sources through `localStorage` key `obsidianBrain.sourceRegistry` and active source/category filters through `obsidianBrain.activeSourceFilters`. It supports registry import/export as JSON. This keeps the first registry GUI local, reversible, and easy to test. The limitation is that registry changes are browser-local until exported.

Graph source filters should continue to work, and category filters should allow users to isolate LLM, Code, Image, Music, Video, Audio, Research, Local, Manual, and Unknown groups.

Later Obsidian or plugin integration can persist the same registry model to a config file such as `config/source-registry.json`.

## Project Branding

Phase 4D uses Ghostbrain as the primary interface identity and devdevbuilds as the secondary studio identity.

The top command bar should show a dominant Ghostbrain lockup and a smaller devdevbuilds studio mark. Loading, empty, About, favicon, and app icon states should use assets from `public/brand` while preserving the dark cyber-organic viewer language.

Written studio references in UI copy, documentation, alt text, and config should use `devdevbuilds`. Logo images may preserve approved stylized lettering from the source asset.

## Source Colors

Nodes should use the source color map from `docs/SOURCE_GROUPING.md`. Edges may inherit source color for source-based relationships or use neutral colors for direct links.

Phase 3 uses the generated graph source colors and keeps source identity visible in node materials, hover cards, filters, and selected-node detail tinting.

## View Modes

### Global View

Shows the whole vault as one graph. Best for orientation and discovering dense or isolated regions.

### Source View

Groups the graph by source and source family. Best for provenance and comparing AI systems, manual notes, repos, and local LLM content.

### Project View

Groups notes by project. Best for dashboards, current work, and project-specific memory.

### Local View

Shows a selected note and its nearby graph neighborhood. Best for reading context without visual overload.

### Cleanup View

Highlights missing metadata, unknown sources, broken links, orphaned notes, duplicates, and stale statuses.

In Phase 3, this mode exists as a placeholder command bar option. Full cleanup automation is reserved for a later phase.

### Future Dream View

Reserved for speculative expansion, resurfacing, and generated connections. This mode should remain designed but unimplemented during the MVP.

In Phase 3, this mode exists as a placeholder command bar option only.
