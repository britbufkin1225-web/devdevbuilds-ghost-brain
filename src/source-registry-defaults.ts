import type { GraphData, GraphNode } from "./graph-types.ts";
import type { SourceCategory, SourceRegistryEntry } from "./source-registry-types.ts";

export const DEFAULT_SOURCE_REGISTRY: SourceRegistryEntry[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    family: "openai",
    category: "llm",
    color: "#2f80ff",
    enabled: true,
    aliases: ["chatgpt", "openai-chatgpt", "gpt"]
  },
  {
    id: "codex",
    label: "Codex",
    family: "openai",
    category: "code",
    color: "#39ff88",
    enabled: true,
    aliases: ["codex", "openai-codex"]
  },
  {
    id: "claude",
    label: "Claude",
    family: "anthropic",
    category: "llm",
    color: "#8f5cff",
    enabled: true,
    aliases: ["claude", "anthropic-claude"]
  },
  {
    id: "claude-code",
    label: "Claude Code",
    family: "anthropic",
    category: "code",
    color: "#b05cff",
    enabled: true,
    aliases: ["claude-code", "claude code"]
  },
  {
    id: "gemini",
    label: "Gemini",
    family: "google",
    category: "llm",
    color: "#00d4ff",
    enabled: true,
    aliases: ["gemini", "google-gemini"]
  },
  {
    id: "midjourney",
    label: "Midjourney",
    family: "midjourney",
    category: "image",
    color: "#ff4fd8",
    enabled: true,
    aliases: ["midjourney", "mj"]
  },
  {
    id: "ollama",
    label: "Ollama",
    family: "local",
    category: "local",
    color: "#ffb020",
    enabled: true,
    aliases: ["ollama", "local-llm"]
  },
  {
    id: "github",
    label: "GitHub",
    family: "github",
    category: "code",
    color: "#f5f5f5",
    enabled: true,
    aliases: ["github", "gh"]
  },
  {
    id: "manual",
    label: "Manual",
    family: "manual",
    category: "manual",
    color: "#b8c0cc",
    enabled: true,
    aliases: ["manual", "human", "handwritten"]
  },
  {
    id: "unknown",
    label: "Unknown",
    family: "unknown",
    category: "unknown",
    color: "#666666",
    enabled: true,
    aliases: ["unknown", "unclassified"]
  }
];

export const FUTURE_SOURCE_EXAMPLES: SourceRegistryEntry[] = [
  {
    id: "suno",
    label: "Suno",
    family: "suno",
    category: "music",
    color: "#ffcc33",
    enabled: false,
    aliases: ["suno", "suno-ai"]
  },
  {
    id: "udio",
    label: "Udio",
    family: "udio",
    category: "music",
    color: "#00e0a4",
    enabled: false,
    aliases: ["udio"]
  },
  {
    id: "stable-diffusion",
    label: "Stable Diffusion",
    family: "stability",
    category: "image",
    color: "#7dd3fc",
    enabled: false,
    aliases: ["stable-diffusion", "sd", "stability"]
  },
  {
    id: "runway",
    label: "Runway",
    family: "runway",
    category: "video",
    color: "#a3ff12",
    enabled: false,
    aliases: ["runway", "runwayml"]
  },
  {
    id: "lm-studio",
    label: "LM Studio",
    family: "local",
    category: "local",
    color: "#38bdf8",
    enabled: false,
    aliases: ["lm-studio", "lm studio"]
  },
  {
    id: "perplexity",
    label: "Perplexity",
    family: "perplexity",
    category: "research",
    color: "#20e3b2",
    enabled: false,
    aliases: ["perplexity", "pplx"]
  }
];

export type RegistryIndex = {
  entries: SourceRegistryEntry[];
  byId: Map<string, SourceRegistryEntry>;
  unknown: SourceRegistryEntry;
};

export function createRegistryIndex(entries: SourceRegistryEntry[]): RegistryIndex {
  const unknown = entries.find((entry) => entry.id === "unknown") ?? DEFAULT_SOURCE_REGISTRY.at(-1)!;
  return {
    entries,
    byId: new Map(entries.map((entry) => [entry.id, entry])),
    unknown
  };
}

export function resolveSourceEntry(sourceId: string, registry: RegistryIndex): SourceRegistryEntry {
  return registry.byId.get(sourceId) ?? createTemporarySourceEntry(sourceId, registry.unknown);
}

export function createTemporarySourceEntry(sourceId: string, fallback: SourceRegistryEntry): SourceRegistryEntry {
  if (!sourceId) {
    return fallback;
  }

  return {
    id: sourceId,
    label: `${sourceId} (unregistered)`,
    family: "unknown",
    category: "unknown",
    color: fallback.color,
    enabled: true,
    aliases: [sourceId]
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
  const uniqueTemporaryEntries = Array.from(
    new Map(temporaryEntries.map((entry) => [entry.id, entry])).values()
  );

  return [...entries, ...uniqueTemporaryEntries];
}

export function isSourceCategory(value: string): value is SourceCategory {
  return [
    "llm",
    "code",
    "image",
    "music",
    "video",
    "audio",
    "research",
    "local",
    "manual",
    "unknown"
  ].includes(value);
}

