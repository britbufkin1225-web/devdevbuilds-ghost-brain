import type { CSSProperties } from "react";
import type { GraphNode } from "../graph-types.ts";
import { formatLabel } from "../graph-utils.ts";
import type { RegistryIndex } from "../source-registry-defaults.ts";
import { resolveSourceEntry } from "../source-registry-defaults.ts";

type Props = {
  node: GraphNode | null;
  registry: RegistryIndex;
};

export default function HoverCard({ node, registry }: Props) {
  if (!node) {
    return null;
  }

  const source = resolveSourceEntry(node.source, registry);

  return (
    <div
      className="hover-card"
      style={{ "--hover-color": source.color } as CSSProperties & Record<"--hover-color", string>}
    >
      <div className="hover-card-kicker">{source.label}</div>
      <h2>{node.title}</h2>
      <p>{node.project}</p>
      <dl>
        <div>
          <dt>Type</dt>
          <dd>{formatLabel(node.type)}</dd>
        </div>
        <div>
          <dt>Tags</dt>
          <dd>{node.tags.join(", ")}</dd>
        </div>
        <div>
          <dt>Path</dt>
          <dd>{node.path}</dd>
        </div>
      </dl>
    </div>
  );
}
