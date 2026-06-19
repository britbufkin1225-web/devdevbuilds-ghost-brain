import { useCallback, useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import type { GraphNode, ViewMode } from "../graph-types.ts";
import type { VisibleGraphData } from "../graph-utils.ts";
import { nodeSize } from "../graph-utils.ts";
import type { RegistryIndex } from "../source-registry-defaults.ts";
import { resolveSourceEntry } from "../source-registry-defaults.ts";

type Props = {
  graph: VisibleGraphData;
  selectedNode: GraphNode | null;
  hoveredNode: GraphNode | null;
  registry: RegistryIndex;
  viewMode: ViewMode;
  onHoverNode: (node: GraphNode | null) => void;
  onSelectNode: (node: GraphNode | null) => void;
};

type ForceNode = GraphNode & {
  x?: number;
  y?: number;
  z?: number;
};

export default function BrainGraph({
  graph,
  selectedNode,
  hoveredNode,
  registry,
  viewMode,
  onHoverNode,
  onSelectNode
}: Props) {
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();

    for (const node of graph.nodes) {
      map.set(node.id, new Set());
    }

    for (const link of graph.links) {
      map.get(String(link.source))?.add(String(link.target));
      map.get(String(link.target))?.add(String(link.source));
    }

    return map;
  }, [graph]);

  const isRelated = useCallback(
    (node: GraphNode) => {
      if (!hoveredNode && !selectedNode) {
        return true;
      }

      const focus = hoveredNode ?? selectedNode;
      return focus?.id === node.id || adjacency.get(focus?.id ?? "")?.has(node.id);
    },
    [adjacency, hoveredNode, selectedNode]
  );

  const renderNode = useCallback(
    (nodeObject: object) => {
      const node = nodeObject as ForceNode;
      const selected = selectedNode?.id === node.id;
      const hovered = hoveredNode?.id === node.id;
      const related = isRelated(node);
      const color = resolveSourceEntry(node.source, registry).color;
      const scale = nodeSize(node.type) * (selected ? 1.45 : hovered ? 1.25 : 1);
      const opacity = selected ? 0.96 : related ? 0.82 : 0.28;

      const group = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: selected ? 0.35 : hovered ? 1.25 : 0.72,
        roughness: selected ? 0.18 : 0.42,
        metalness: selected ? 0.5 : 0.25,
        transparent: true,
        opacity
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(scale, 24, 24), material);

      group.add(sphere);

      if (!selected) {
        const glowMaterial = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: hovered ? 0.22 : 0.12,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const glow = new THREE.Mesh(new THREE.SphereGeometry(scale * 1.75, 24, 24), glowMaterial);
        group.add(glow);
      } else {
        const rimMaterial = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.5,
          wireframe: true
        });
        const rim = new THREE.Mesh(new THREE.SphereGeometry(scale * 1.18, 16, 16), rimMaterial);
        group.add(rim);
      }

      return group;
    },
    [hoveredNode, isRelated, registry, selectedNode]
  );

  return (
    <div className={`brain-graph mode-${viewMode}`}>
      <div className="neural-surface" aria-hidden="true" />
      <ForceGraph3D
        graphData={graph}
        backgroundColor="rgba(0,0,0,0)"
        nodeId="id"
        nodeLabel={(node: object) => (node as GraphNode).title}
        nodeThreeObject={renderNode}
        linkColor={(link: { source: unknown }) => {
          const source = typeof link.source === "object" ? (link.source as GraphNode) : null;
          return source ? `${resolveSourceEntry(source.source, registry).color}88` : "rgba(107, 244, 255, 0.34)";
        }}
        linkOpacity={0.34}
        linkWidth={(link: { source: unknown; target: unknown }) => {
          const source = typeof link.source === "object" ? (link.source as GraphNode) : null;
          const target = typeof link.target === "object" ? (link.target as GraphNode) : null;
          const focusId = hoveredNode?.id ?? selectedNode?.id;

          return focusId && (source?.id === focusId || target?.id === focusId) ? 1.8 : 0.7;
        }}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={(link: { source: unknown; target: unknown }) => {
          const source = typeof link.source === "object" ? (link.source as GraphNode) : null;
          const target = typeof link.target === "object" ? (link.target as GraphNode) : null;
          const focusId = hoveredNode?.id ?? selectedNode?.id;

          return focusId && (source?.id === focusId || target?.id === focusId) ? 2.5 : 0.8;
        }}
        linkDirectionalParticleSpeed={0.004}
        onNodeHover={(node: object | null) => onHoverNode((node as GraphNode | null) ?? null)}
        onNodeClick={(node: object) => onSelectNode(node as GraphNode)}
        onBackgroundClick={() => onSelectNode(null)}
        cooldownTicks={80}
        enableNodeDrag
      />
    </div>
  );
}
