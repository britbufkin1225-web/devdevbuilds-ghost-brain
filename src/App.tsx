import { useEffect, useMemo, useState } from "react";
import BrainGraph from "./components/BrainGraph.tsx";
import HoverCard from "./components/HoverCard.tsx";
import LeftSidebar from "./components/LeftSidebar.tsx";
import RightDetailPanel from "./components/RightDetailPanel.tsx";
import SourceModelsPanel from "./components/SourceModelsPanel.tsx";
import TopCommandBar from "./components/TopCommandBar.tsx";
import type { Filters, GraphData, GraphNode, ViewMode } from "./graph-types.ts";
import { createInitialFilters, filterGraph } from "./graph-utils.ts";
import { createRegistryIndex, mergeRegistryWithGraphSources, resolveSourceEntry } from "./source-registry-defaults.ts";
import type { SourceRegistryEntry } from "./source-registry-types.ts";
import { loadSourceRegistry, resetSourceRegistry, saveSourceRegistry } from "./source-registry-storage.ts";

export default function App() {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("global");
  const [filters, setFilters] = useState<Filters | null>(null);
  const [registryEntries, setRegistryEntries] = useState<SourceRegistryEntry[]>(() => loadSourceRegistry());
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const effectiveRegistryEntries = useMemo(
    () => mergeRegistryWithGraphSources(registryEntries, graph),
    [graph, registryEntries]
  );
  const registry = useMemo(() => createRegistryIndex(effectiveRegistryEntries), [effectiveRegistryEntries]);

  useEffect(() => {
    let isMounted = true;

    fetch("/data/graph.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Graph data request failed with ${response.status}`);
        }

        return response.json() as Promise<GraphData>;
      })
      .then((nextGraph) => {
        if (!isMounted) {
          return;
        }

        setGraph(nextGraph);
        setFilters(createInitialFilters(nextGraph, createRegistryIndex(mergeRegistryWithGraphSources(registryEntries, nextGraph))));
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "Unable to load graph data.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleGraph = useMemo(
    () => (graph && filters ? filterGraph(graph, filters, registry) : { nodes: [], links: [] }),
    [filters, graph, registry]
  );
  const updateFilters = (nextFilters: Filters | ((current: Filters) => Filters)) => {
    setFilters((current) => {
      if (!current) {
        return current;
      }

      return typeof nextFilters === "function" ? nextFilters(current) : nextFilters;
    });
  };
  const updateRegistry = (entries: SourceRegistryEntry[]) => {
    setRegistryEntries(entries);
    saveSourceRegistry(entries);

    if (graph) {
      setFilters(createInitialFilters(graph, createRegistryIndex(mergeRegistryWithGraphSources(entries, graph))));
    }
  };
  const resetRegistry = () => {
    const defaults = resetSourceRegistry();
    setRegistryEntries(defaults);

    if (graph) {
      setFilters(createInitialFilters(graph, createRegistryIndex(mergeRegistryWithGraphSources(defaults, graph))));
    }
  };
  const selectedSource = selectedNode?.source ?? hoveredNode?.source;
  const selectedProject = selectedNode?.project ?? hoveredNode?.project;
  const selectedSourceLabel = selectedSource ? resolveSourceEntry(selectedSource, registry).label : null;

  if (loadError) {
    return (
      <div className="app-shell app-message-shell">
        <section className="app-message panel" role="alert">
          <h1>Graph data could not be loaded</h1>
          <p>{loadError}</p>
          <p>Run `npm run build:graph` to generate `public/data/graph.json`, then refresh the viewer.</p>
        </section>
      </div>
    );
  }

  if (!graph || !filters) {
    return (
      <div className="app-shell app-message-shell">
        <section className="app-message panel" aria-live="polite">
          <h1>Loading Ghost Brain graph</h1>
          <p>Reading `/data/graph.json` from the local Vite static path.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopCommandBar mode={viewMode} onModeChange={setViewMode} onOpenRegistry={() => setIsRegistryOpen(true)} />

      <main className="workspace">
        <LeftSidebar graph={graph} filters={filters} registry={registry} onFiltersChange={updateFilters} />

        <section className="graph-stage" aria-label="3D Ghost Brain graph viewer">
          <BrainGraph
            graph={visibleGraph}
            selectedNode={selectedNode}
            hoveredNode={hoveredNode}
            registry={registry}
            viewMode={viewMode}
            onHoverNode={setHoveredNode}
            onSelectNode={setSelectedNode}
          />
          <HoverCard node={hoveredNode} registry={registry} />
          <div className="status-strip">
            <span>{visibleGraph.nodes.length} visible nodes</span>
            <span>{visibleGraph.links.length} visible edges</span>
            {selectedSourceLabel ? <span>Source: {selectedSourceLabel}</span> : null}
            {selectedProject ? <span>Project: {selectedProject}</span> : null}
          </div>
        </section>

        <RightDetailPanel node={selectedNode} registry={registry} />
      </main>

      {isRegistryOpen ? (
        <SourceModelsPanel
          entries={registryEntries}
          onChange={updateRegistry}
          onReset={resetRegistry}
          onClose={() => setIsRegistryOpen(false)}
        />
      ) : null}
    </div>
  );
}
