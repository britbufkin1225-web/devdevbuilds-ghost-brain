import type { Source, SourceFamily } from "./types.ts";

export type SourceConfig = {
  source: Source;
  sourceFamily: SourceFamily;
  label: string;
  color: string;
};

export const SOURCE_CONFIG: SourceConfig[] = [
  { source: "chatgpt", sourceFamily: "openai", label: "ChatGPT", color: "#2f80ff" },
  { source: "codex", sourceFamily: "openai", label: "Codex", color: "#39ff88" },
  { source: "claude", sourceFamily: "anthropic", label: "Claude", color: "#8f5cff" },
  { source: "claude-code", sourceFamily: "anthropic", label: "Claude Code", color: "#b05cff" },
  { source: "gemini", sourceFamily: "google", label: "Gemini", color: "#00d4ff" },
  { source: "midjourney", sourceFamily: "midjourney", label: "Midjourney", color: "#ff4fd8" },
  { source: "ollama", sourceFamily: "local", label: "Ollama", color: "#ffb020" },
  { source: "github", sourceFamily: "github", label: "GitHub", color: "#f5f5f5" },
  { source: "manual", sourceFamily: "manual", label: "Manual", color: "#b8c0cc" },
  { source: "unknown", sourceFamily: "unknown", label: "Unknown", color: "#666666" }
];

export const SOURCE_BY_ID = new Map(SOURCE_CONFIG.map((item) => [item.source, item]));

export function getSourceColor(source: Source): string {
  return SOURCE_BY_ID.get(source)?.color ?? SOURCE_BY_ID.get("unknown")!.color;
}

