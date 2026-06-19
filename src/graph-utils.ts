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

export function normalizeGraphData(value: unknown): GraphData {
  const record = isRecord(value) ? value : {};
  const nodes = Array.isArray(record.nodes) ? record.nodes.map(normalizeNode).filter(isGraphNode) : [];
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = Array.isArray(record.edges)
    ? record.edges.map(normalizeEdge).filter((edge): edge is GraphEdge => edge !== null && nodeIds.has(edge.source))
    : [];
  const sourceGroups = countBy(nodes, (node) => node.source).map(([source, count]) => ({
    source,
    sourceFamily: nodes.find((node) => node.source === source)?.sourceFamily ?? "unknown",
    color: "#666666",
    count
  }));
  const projects = countBy(nodes, (node) => node.project).map(([name, count]) => ({ name, count }));
  const types = countBy(nodes, (node) => node.type).map(([name, count]) => ({ name, count }));

  return {
    generatedAt: typeof record.generatedAt === "string" ? record.generatedAt : new Date().toISOString(),
    summary: {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      sourceCount: sourceGroups.length,
      projectCount: projects.length,
      typeCount: types.length
    },
    sourceGroups,
    projects,
    types,
    nodes,
    edges
  };
}

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
  const nodes = graph.nodes
    .filter((node) => {
      const source = resolveSourceEntry(node.source, registry);

      return (
        source.enabled &&
        filters.sources.has(source.id) &&
        filters.categories.has(source.category) &&
        filters.projects.has(node.project) &&
        filters.types.has(node.type)
      );
    })
    .map((node) => ({ ...node, tags: [...node.tags] }));
  const visibleNodeIds = new Set(nodes.map((node) => node.id));
  const links = graph.edges.filter(
    (edge) => edge.resolved && visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  ).map((edge) => ({ ...edge }));

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

function normalizeNode(value: unknown): GraphNode | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = stringOrEmpty(value.id);
  const title = stringOrEmpty(value.title) || id;

  if (!id || !title) {
    return null;
  }

  return {
    id,
    title,
    type: stringOrEmpty(value.type) || "unknown-note",
    source: stringOrEmpty(value.source) || "unknown",
    sourceFamily: stringOrEmpty(value.sourceFamily) || "unknown",
    project: stringOrEmpty(value.project) || "Unknown Project",
    status: stringOrEmpty(value.status) || "unknown",
    path: stringOrEmpty(value.path),
    tags: Array.isArray(value.tags) ? value.tags.map(String) : [],
    dateCreated: stringOrEmpty(value.dateCreated),
    linkCount: typeof value.linkCount === "number" ? value.linkCount : 0
  };
}

function normalizeEdge(value: unknown): GraphEdge | null {
  if (!isRecord(value)) {
    return null;
  }

  const source = stringOrEmpty(value.source);
  const target = stringOrEmpty(value.target);

  if (!source || !target) {
    return null;
  }

  return {
    id: stringOrEmpty(value.id) || `${source}-${target}`,
    source,
    target,
    targetTitle: stringOrEmpty(value.targetTitle) || target,
    type: "wikilink",
    resolved: value.resolved !== false
  };
}

function isGraphNode(value: GraphNode | null): value is GraphNode {
  return value !== null;
}

function countBy(values: GraphNode[], getKey: (node: GraphNode) => string): Array<[string, number]> {
  const counts = new Map<string, number>();

  for (const value of values) {
    const key = getKey(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringOrEmpty(value: unknown): string {
  return typeof value === "string" ? value : "";
}
