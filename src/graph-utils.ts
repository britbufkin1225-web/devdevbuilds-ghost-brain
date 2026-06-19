import type { Filters, GraphData, GraphEdge, GraphNode } from "./graph-types.ts";
import type { RegistryIndex } from "./source-registry-defaults.ts";
import { resolveSourceEntry } from "./source-registry-defaults.ts";

export type ForceGraphLink = GraphEdge & {
  source: string;
  target: string;
};

export type VisibleGraphData = {
  nodes: GraphNode[];
  links: ForceGraphLink[];
};

export function createInitialFilters(graph: GraphData, registry: RegistryIndex): Filters {
  const graphSources = new Set(graph.nodes.map((node) => node.source));
  const enabledGraphSources = registry.entries
    .filter((entry) => entry.enabled && graphSources.has(entry.id))
    .map((entry) => entry.id);
  const enabledGraphCategories = registry.entries
    .filter((entry) => entry.enabled && graphSources.has(entry.id))
    .map((entry) => entry.category);

  return {
    sources: new Set(enabledGraphSources),
    categories: new Set(enabledGraphCategories),
    projects: new Set(graph.projects.map((project) => project.name)),
    types: new Set(graph.types.map((type) => type.name))
  };
}

export function filterGraph(graph: GraphData, filters: Filters, registry: RegistryIndex): VisibleGraphData {
  const nodes = graph.nodes.filter(
    (node) => {
      const source = resolveSourceEntry(node.source, registry);

      return (
        source.enabled &&
        filters.sources.has(source.id) &&
        filters.categories.has(source.category) &&
        filters.projects.has(node.project) &&
        filters.types.has(node.type)
      );
    }
  );
  const visibleNodeIds = new Set(nodes.map((node) => node.id));
  const links = graph.edges.filter(
    (edge) => edge.resolved && visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );

  return { nodes, links };
}

export function toggleSetValue(current: Set<string>, value: string): Set<string> {
  const next = new Set(current);

  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }

  return next;
}

export function nodeSize(type: string): number {
  if (type === "project-note" || type === "repo-note") {
    return 8;
  }

  if (type === "unknown-note") {
    return 4.5;
  }

  return 6;
}

export function formatLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
