import type { GraphData, GraphNode } from "./graph-types.ts";
import type { SourceRegistryEntry } from "./source-registry-types.ts";

const DEFAULT_CREATED_AT = "2026-06-19T00:00:00.000Z";

export const DEFAULT_SOURCE_REGISTRY: SourceRegistryEntry[] = [
  defaultEntry("chatgpt", "ChatGPT / OpenAI", "LLM", "OpenAI ChatGPT conversations, planning sessions, and reasoning notes.", "#2f80ff"),
  defaultEntry("claude", "Claude", "LLM", "Anthropic Claude writing, strategy, and analysis sessions.", "#8f5cff"),
  defaultEntry("claude-code", "Claude Code", "Code", "Anthropic Claude Code coding sessions and agent work.", "#b05cff"),
  defaultEntry("gemini", "Gemini", "LLM", "Google Gemini research, analysis, and multimodal notes.", "#00d4ff"),
  defaultEntry("midjourney", "Midjourney", "Image", "Midjourney image prompts, visual concepts, and generation runs.", "#ff4fd8"),
  defaultEntry("canva", "Canva", "Image", "Canva designs, visual assets, and presentation/source artifacts.", "#20c4cb"),
  defaultEntry("codex", "VS Code / Code Session", "Code", "Code sessions, editor work, coding agents, and build notes.", "#39ff88"),
  defaultEntry("github", "GitHub", "Code", "GitHub repository, pull request, issue, and release notes.", "#f5f5f5"),
  defaultEntry("manual", "Manual Note", "Manual", "Human-authored project notes and manual records.", "#b8c0cc"),
  defaultEntry("ollama", "Local File", "Local", "Local files, local model output, and machine-local notes.", "#ffb020"),
  defaultEntry("unknown", "Unknown Source", "Unknown", "Fallback bucket for unclassified or missing provenance.", "#666666")
];

export const FUTURE_SOURCE_EXAMPLES: SourceRegistryEntry[] = [
  defaultEntry("suno", "Suno", "Music", "Music generation source.", "#ffcc33", false),
  defaultEntry("udio", "Udio", "Music", "Music generation source.", "#00e0a4", false),
  defaultEntry("stable-diffusion", "Stable Diffusion", "Image", "Image generation source.", "#7dd3fc", false),
  defaultEntry("runway", "Runway", "Video", "Video generation source.", "#a3ff12", false),
  defaultEntry("lm-studio", "LM Studio", "Local", "Local LLM source.", "#38bdf8", false),
  defaultEntry("perplexity", "Perplexity", "Research", "Research and answer engine source.", "#20e3b2", false)
];

export type RegistryIndex = {
  entries: SourceRegistryEntry[];
  byId: Map<string, SourceRegistryEntry>;
  unknown: SourceRegistryEntry;
  defaultIds: Set<string>;
};

export function createRegistryIndex(entries: SourceRegistryEntry[]): RegistryIndex {
  const unknown = entries.find((entry) => entry.id === "unknown") ?? DEFAULT_SOURCE_REGISTRY.at(-1)!;

  return {
    entries,
    byId: new Map(entries.map((entry) => [entry.id, entry])),
    unknown,
    defaultIds: new Set(DEFAULT_SOURCE_REGISTRY.map((entry) => entry.id))
  };
}

export function resolveSourceEntry(sourceId: string, registry: RegistryIndex): SourceRegistryEntry {
  return registry.byId.get(sourceId) ?? createTemporarySourceEntry(sourceId, registry.unknown);
}

export function createTemporarySourceEntry(sourceId: string, fallback: SourceRegistryEntry): SourceRegistryEntry {
  if (!sourceId) {
    return fallback;
  }

  const now = new Date().toISOString();

  return {
    id: sourceId,
    name: `${sourceId} (unregistered)`,
    category: "Unknown",
    description: "Temporary display object for a graph source id that is not in the registry.",
    enabled: true,
    color: fallback.color,
    createdAt: now,
    updatedAt: now
  };
}

export function mergeRegistryWithGraphSources(
  entries: SourceRegistryEntry[],
  graph: GraphData | null
): SourceRegistryEntry[] {
  if (!graph) {
    return entries;
  }

  const knownIds = new Set(entries.map((entry) => entry.id));
  const fallback = entries.find((entry) => entry.id === "unknown") ?? DEFAULT_SOURCE_REGISTRY.at(-1)!;
  const temporaryEntries = graph.nodes
    .filter((node: GraphNode) => !knownIds.has(node.source))
    .map((node) => createTemporarySourceEntry(node.source, fallback));
  const uniqueTemporaryEntries = Array.from(new Map(temporaryEntries.map((entry) => [entry.id, entry])).values());

  return [...entries, ...uniqueTemporaryEntries];
}

function defaultEntry(
  id: string,
  name: string,
  category: SourceRegistryEntry["category"],
  description: string,
  color: string,
  enabled = true
): SourceRegistryEntry {
  return {
    id,
    name,
    category,
    description,
    enabled,
    color,
    createdAt: DEFAULT_CREATED_AT,
    updatedAt: DEFAULT_CREATED_AT
  };
}
