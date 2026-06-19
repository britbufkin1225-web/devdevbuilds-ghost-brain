import { DEFAULT_SOURCE_REGISTRY } from "./source-registry-defaults.ts";
import type { Filters } from "./graph-types.ts";
import type { SourceCategory, SourceRegistryEntry } from "./source-registry-types.ts";
import { SOURCE_CATEGORIES } from "./source-registry-types.ts";

export const SOURCE_REGISTRY_KEY = "obsidianBrain.sourceRegistry";
export const ACTIVE_SOURCE_FILTER_KEY = "obsidianBrain.activeSourceFilters";

type StoredFilters = {
  sources: string[];
  categories: SourceCategory[];
};

export function loadSourceRegistry(): SourceRegistryEntry[] {
  if (!canUseLocalStorage()) {
    return cloneEntries(DEFAULT_SOURCE_REGISTRY);
  }

  const raw = window.localStorage.getItem(SOURCE_REGISTRY_KEY);

  if (!raw) {
    const defaults = cloneEntries(DEFAULT_SOURCE_REGISTRY);
    saveSourceRegistry(defaults);
    return defaults;
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

  window.localStorage.setItem(SOURCE_REGISTRY_KEY, exportSourceRegistry(entries));
}

export function resetSourceRegistry(): SourceRegistryEntry[] {
  const defaults = cloneEntries(DEFAULT_SOURCE_REGISTRY);
  saveSourceRegistry(defaults);
  clearActiveSourceFilters();
  return defaults;
}

export function exportSourceRegistry(entries: SourceRegistryEntry[]): string {
  return `${JSON.stringify(normalizeRegistry(entries), null, 2)}\n`;
}

export function importSourceRegistry(json: string): SourceRegistryEntry[] {
  return normalizeRegistry(JSON.parse(json));
}

export function saveActiveSourceFilters(filters: Filters): void {
  if (!canUseLocalStorage()) {
    return;
  }

  const stored: StoredFilters = {
    sources: Array.from(filters.sources),
    categories: Array.from(filters.categories) as SourceCategory[]
  };

  window.localStorage.setItem(ACTIVE_SOURCE_FILTER_KEY, JSON.stringify(stored));
}

export function loadActiveSourceFilters(): StoredFilters | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(ACTIVE_SOURCE_FILTER_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredFilters>;
    return {
      sources: Array.isArray(parsed.sources) ? parsed.sources.map(String) : [],
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.filter((category): category is SourceCategory => SOURCE_CATEGORIES.includes(category))
        : []
    };
  } catch {
    return null;
  }
}

export function clearActiveSourceFilters(): void {
  if (canUseLocalStorage()) {
    window.localStorage.removeItem(ACTIVE_SOURCE_FILTER_KEY);
  }
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
  const name = String(record.name ?? record.label ?? "").trim();
  const category = normalizeCategory(String(record.category ?? "Unknown"));
  const description = String(record.description ?? record.family ?? "").trim();
  const color = String(record.color ?? "#666666").trim();
  const createdAt = normalizeDate(record.createdAt);
  const updatedAt = normalizeDate(record.updatedAt);

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    category,
    description,
    enabled: typeof record.enabled === "boolean" ? record.enabled : true,
    color: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#666666",
    createdAt,
    updatedAt
  };
}

function normalizeCategory(value: string): SourceCategory {
  const match = SOURCE_CATEGORIES.find((category) => category.toLowerCase() === value.toLowerCase());
  return match ?? "Unknown";
}

function normalizeDate(value: unknown): string {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return value;
  }

  return new Date().toISOString();
}

function cloneEntries(entries: SourceRegistryEntry[]): SourceRegistryEntry[] {
  return entries.map(cloneEntry);
}

function cloneEntry(entry: SourceRegistryEntry): SourceRegistryEntry {
  return { ...entry };
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

