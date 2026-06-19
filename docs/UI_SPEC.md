# UI Spec

## 3D Neural Visual Metaphor

Ghost Brain should feel like a navigable memory space. The graph represents the vault as a neural structure where source, project, folder, and relationship affect layout and appearance.

The interface should prioritize clarity over spectacle. Motion, glow, depth, and clustering should help the user understand relationships.

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
- Project
- Note type
- Status
- Tags
- Date range
- Cleanup state

## Source Colors

Nodes should use the source color map from `docs/SOURCE_GROUPING.md`. Edges may inherit source color for source-based relationships or use neutral colors for direct links.

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

### Future Dream View

Reserved for speculative expansion, resurfacing, and generated connections. This mode should remain designed but unimplemented during the MVP.

