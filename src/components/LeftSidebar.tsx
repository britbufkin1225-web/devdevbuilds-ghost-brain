import type { CSSProperties, ReactNode } from "react";
import type { Filters, GraphData } from "../graph-types.ts";
import { formatLabel, toggleSetValue } from "../graph-utils.ts";
import type { RegistryIndex } from "../source-registry-defaults.ts";
import { resolveSourceEntry } from "../source-registry-defaults.ts";

type Props = {
  graph: GraphData;
  filters: Filters;
  registry: RegistryIndex;
  onFiltersChange: (nextFilters: Filters | ((current: Filters) => Filters)) => void;
};

export default function LeftSidebar({ graph, filters, registry, onFiltersChange }: Props) {
  function toggleFilter(group: keyof Filters, value: string) {
    onFiltersChange((current) => ({
      ...current,
      [group]: toggleSetValue(current[group], value)
    }));
  }

  function resetFilters() {
    const graphSourceIds = new Set(graph.nodes.map((node) => node.source));
    const activeSources = registry.entries.filter((entry) => entry.enabled && graphSourceIds.has(entry.id));

    onFiltersChange({
      sources: new Set(activeSources.map((entry) => entry.id)),
      categories: new Set(activeSources.map((entry) => entry.category)),
      projects: new Set(graph.projects.map((project) => project.name)),
      types: new Set(graph.types.map((type) => type.name))
    });
  }

  const sourceCounts = new Map(graph.sourceGroups.map((group) => [group.source, group.count]));
  const graphSourceIds = new Set(graph.sourceGroups.map((group) => group.source));
  const sourcesInGraph = registry.entries.filter((entry) => entry.enabled && graphSourceIds.has(entry.id));
  const categoryCounts = new Map<string, number>();

  for (const node of graph.nodes) {
    const entry = resolveSourceEntry(node.source, registry);

    if (entry.enabled) {
      categoryCounts.set(entry.category, (categoryCounts.get(entry.category) ?? 0) + 1);
    }
  }

  return (
    <aside className="left-sidebar panel">
      <div className="panel-heading">
        <span>Filters</span>
        <button type="button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      <FilterSection title="Sources">
        {sourcesInGraph.map((source) => {
          return (
            <button
              key={source.id}
              className={`filter-pill ${filters.sources.has(source.id) ? "active" : ""}`}
              type="button"
              onClick={() => toggleFilter("sources", source.id)}
              style={{ "--source-color": source.color } as CSSProperties & Record<"--source-color", string>}
            >
              <span className="source-dot" />
              <span>{source.name}</span>
              <strong>{sourceCounts.get(source.id) ?? 0}</strong>
            </button>
          );
        })}
      </FilterSection>

      <FilterSection title="Categories">
        {Array.from(categoryCounts.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, count]) => (
            <button
              key={category}
              className={`filter-pill ${filters.categories.has(category) ? "active" : ""}`}
              type="button"
              onClick={() => toggleFilter("categories", category)}
            >
              <span>{category}</span>
              <strong>{count}</strong>
            </button>
          ))}
      </FilterSection>

      <FilterSection title="Projects">
        {graph.projects.map((project) => (
          <button
            key={project.name}
            className={`filter-pill ${filters.projects.has(project.name) ? "active" : ""}`}
            type="button"
            onClick={() => toggleFilter("projects", project.name)}
          >
            <span>{project.name}</span>
            <strong>{project.count}</strong>
          </button>
        ))}
      </FilterSection>

      <FilterSection title="Types">
        {graph.types.map((type) => (
          <button
            key={type.name}
            className={`filter-pill ${filters.types.has(type.name) ? "active" : ""}`}
            type="button"
            onClick={() => toggleFilter("types", type.name)}
          >
            <span>{formatLabel(type.name)}</span>
            <strong>{type.count}</strong>
          </button>
        ))}
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="filter-section">
      <h2>{title}</h2>
      <div className="filter-stack">{children}</div>
    </section>
  );
}
