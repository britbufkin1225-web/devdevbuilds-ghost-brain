import { DEFAULT_SOURCE_REGISTRY } from "./source-registry-defaults.ts";
import type { SourceRegistryEntry } from "./source-registry-types.ts";
import { SOURCE_CATEGORIES } from "./source-registry-types.ts";

const STORAGE_KEY = "devdevbuilds-ghost-brain.source-registry.v1";

export function loadSourceRegistry(): SourceRegistryEntry[] {
  if (!canUseLocalStorage()) {
    return cloneEntries(DEFAULT_SOURCE_REGISTRY);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return cloneEntries(DEFAULT_SOURCE_REGISTRY);
  }

  try {
    return normalizeRegistry(JSON.parse(raw));
  } catch {
    return cloneEntries(DEFAULT_SOURCE_REGISTRY);
  }
}

export function saveSourceRegistry(entries: SourceRegistryEntry[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, exportSourceRegistry(entries));
}

export function resetSourceRegistry(): SourceRegistryEntry[] {
  const defaults = cloneEntries(DEFAULT_SOURCE_REGISTRY);
  saveSourceRegistry(defaults);
  return defaults;
}

export function exportSourceRegistry(entries: SourceRegistryEntry[]): string {
  return `${JSON.stringify(normalizeRegistry(entries), null, 2)}\n`;
}

export function importSourceRegistry(json: string): SourceRegistryEntry[] {
  return normalizeRegistry(JSON.parse(json));
}

function normalizeRegistry(value: unknown): SourceRegistryEntry[] {
  if (!Array.isArray(value)) {
    throw new Error("Registry JSON must be an array.");
  }

  const entries = value.map(normalizeEntry).filter((entry): entry is SourceRegistryEntry => entry !== null);
  const byId = new Map<string, SourceRegistryEntry>();

  for (const entry of entries) {
    byId.set(entry.id, entry);
  }

  if (!byId.has("unknown")) {
    byId.set("unknown", cloneEntry(DEFAULT_SOURCE_REGISTRY.find((entry) => entry.id === "unknown")!));
  }

  return Array.from(byId.values());
}

function normalizeEntry(value: unknown): SourceRegistryEntry | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = cleanId(String(record.id ?? ""));
  const label = String(record.label ?? "").trim();
  const family = String(record.family ?? record.provider ?? "").trim();
  const category = String(record.category ?? "unknown").trim();
  const color = String(record.color ?? "#666666").trim();
  const aliases = Array.isArray(record.aliases)
    ? record.aliases.map((alias) => String(alias).trim()).filter(Boolean)
    : [];

  if (!id || !label) {
    return null;
  }

  return {
    id,
    label,
    family: family || "unknown",
    category: SOURCE_CATEGORIES.includes(category as SourceRegistryEntry["category"])
      ? (category as SourceRegistryEntry["category"])
      : "unknown",
    color: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#666666",
    enabled: typeof record.enabled === "boolean" ? record.enabled : true,
    aliases: Array.from(new Set([id, ...aliases]))
  };
}

function cloneEntries(entries: SourceRegistryEntry[]): SourceRegistryEntry[] {
  return entries.map(cloneEntry);
}

function cloneEntry(entry: SourceRegistryEntry): SourceRegistryEntry {
  return {
    ...entry,
    aliases: [...entry.aliases]
  };
}

function cleanId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && "localStorage" in window;
}

