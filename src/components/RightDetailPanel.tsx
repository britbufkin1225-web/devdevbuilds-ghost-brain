import type { CSSProperties } from "react";
import type { GraphNode } from "../graph-types.ts";
import { formatLabel } from "../graph-utils.ts";
import type { RegistryIndex } from "../source-registry-defaults.ts";
import { resolveSourceEntry } from "../source-registry-defaults.ts";

type Props = {
  node: GraphNode | null;
  registry: RegistryIndex;
};

export default function RightDetailPanel({ node, registry }: Props) {
  const source = node ? resolveSourceEntry(node.source, registry) : null;
  const color = source?.color ?? "#00d4ff";

  return (
    <aside
      className="right-sidebar panel"
      style={{ "--selected-color": color } as CSSProperties & Record<"--selected-color", string>}
    >
      {!node ? (
        <div className="empty-detail">
          <p>Hover nodes to preview memory metadata.</p>
          <p>Click nodes to inspect source, project, type, tags, and links.</p>
          <p>Use filters to isolate source, project, and note type groups.</p>
        </div>
      ) : (
        <div className="detail-content">
          <div className="detail-kicker">
            <span className="selected-dot" />
            <span>{source?.name}</span>
          </div>
          <h2>{node.title}</h2>

          <dl className="metadata-list">
            <Metadata label="Source" value={node.source} />
            <Metadata label="Source family" value={node.sourceFamily} />
            <Metadata label="Category" value={source?.category ?? "Unknown"} />
            <Metadata label="Project" value={node.project} />
            <Metadata label="Type" value={formatLabel(node.type)} />
            <Metadata label="Status" value={node.status} />
            <Metadata label="Path" value={node.path} />
            <Metadata label="Created" value={node.dateCreated} />
            <Metadata label="Related count" value={String(node.linkCount)} />
          </dl>

          <div className="tag-cloud" aria-label="Tags">
            {node.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
