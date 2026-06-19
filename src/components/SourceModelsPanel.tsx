import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { SourceCategory, SourceRegistryEntry } from "../source-registry-types.ts";
import { SOURCE_CATEGORIES } from "../source-registry-types.ts";
import { FUTURE_SOURCE_EXAMPLES } from "../source-registry-defaults.ts";
import { exportSourceRegistry, importSourceRegistry } from "../source-registry-storage.ts";
import { formatLabel } from "../graph-utils.ts";

type Props = {
  entries: SourceRegistryEntry[];
  onChange: (entries: SourceRegistryEntry[]) => void;
  onReset: () => void;
  onClose: () => void;
};

type FormState = {
  id: string;
  label: string;
  family: string;
  category: SourceCategory;
  color: string;
  aliases: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  label: "",
  family: "",
  category: "llm",
  color: "#00d4ff",
  aliases: ""
};

export default function SourceModelsPanel({ entries, onChange, onReset, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [registryJson, setRegistryJson] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const categoryCounts = useMemo(() => {
    const counts = new Map<SourceCategory, number>();

    for (const entry of entries) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }

    return counts;
  }, [entries]);

  function updateForm(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function saveEntry() {
    const id = cleanId(form.id);

    if (!id || !form.label.trim()) {
      setMessage("Source id and label are required.");
      return;
    }

    const nextEntry: SourceRegistryEntry = {
      id,
      label: form.label.trim(),
      family: form.family.trim() || "unknown",
      category: form.category,
      color: /^#[0-9a-fA-F]{6}$/.test(form.color) ? form.color : "#666666",
      enabled: entries.find((entry) => entry.id === editingId)?.enabled ?? true,
      aliases: parseAliases(form.aliases, id)
    };
    const withoutEdited = entries.filter((entry) => entry.id !== (editingId ?? id));

    onChange([...withoutEdited, nextEntry].sort((a, b) => a.label.localeCompare(b.label)));
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("Registry entry saved.");
  }

  function editEntry(entry: SourceRegistryEntry) {
    setEditingId(entry.id);
    setForm({
      id: entry.id,
      label: entry.label,
      family: entry.family,
      category: entry.category,
      color: entry.color,
      aliases: entry.aliases.join(", ")
    });
    setMessage(null);
  }

  function toggleEnabled(entry: SourceRegistryEntry) {
    onChange(entries.map((item) => (item.id === entry.id ? { ...item, enabled: !item.enabled } : item)));
  }

  function addExample(example: SourceRegistryEntry) {
    if (entries.some((entry) => entry.id === example.id)) {
      editEntry(entries.find((entry) => entry.id === example.id)!);
      return;
    }

    onChange([...entries, { ...example, aliases: [...example.aliases] }].sort((a, b) => a.label.localeCompare(b.label)));
    setMessage(`${example.label} added to the registry.`);
  }

  function exportRegistry() {
    setRegistryJson(exportSourceRegistry(entries));
    setMessage("Registry JSON exported below.");
  }

  function importRegistry() {
    try {
      const imported = importSourceRegistry(registryJson);
      onChange(imported);
      setMessage("Registry JSON imported.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registry import failed.");
    }
  }

  return (
    <div className="registry-overlay" role="dialog" aria-modal="true" aria-label="Sources and models registry">
      <section className="registry-panel panel">
        <div className="registry-header">
          <div>
            <h2>Sources & Models</h2>
            <p>Manage source identities for LLMs, code tools, media models, research tools, local models, and notes.</p>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="registry-grid">
          <section className="registry-list">
            <div className="registry-section-heading">
              <h3>Registry</h3>
              <button type="button" onClick={onReset}>
                Reset defaults
              </button>
            </div>

            <div className="category-summary">
              {SOURCE_CATEGORIES.map((category) => (
                <span key={category}>
                  {formatLabel(category)}: {categoryCounts.get(category) ?? 0}
                </span>
              ))}
            </div>

            <div className="registry-entry-list">
              {entries.map((entry) => (
                <article key={entry.id} className={`registry-entry ${entry.enabled ? "" : "disabled"}`}>
                  <span
                    className="source-dot"
                    style={{ "--source-color": entry.color } as CSSProperties & Record<"--source-color", string>}
                  />
                  <div>
                    <strong>{entry.label}</strong>
                    <small>
                      {entry.id} / {formatLabel(entry.category)} / {entry.family}
                    </small>
                  </div>
                  <button type="button" onClick={() => toggleEnabled(entry)}>
                    {entry.enabled ? "Enabled" : "Disabled"}
                  </button>
                  <button type="button" onClick={() => editEntry(entry)}>
                    Edit
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="registry-editor">
            <h3>{editingId ? "Edit Source" : "Add Source"}</h3>
            <div className="registry-form">
              <label>
                Label
                <input value={form.label} onChange={(event) => updateForm("label", event.target.value)} />
              </label>
              <label>
                ID
                <input value={form.id} onChange={(event) => updateForm("id", event.target.value)} />
              </label>
              <label>
                Family / provider
                <input value={form.family} onChange={(event) => updateForm("family", event.target.value)} />
              </label>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value as SourceCategory)}
                >
                  {SOURCE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {formatLabel(category)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Color
                <input type="color" value={form.color} onChange={(event) => updateForm("color", event.target.value)} />
              </label>
              <label>
                Aliases
                <input
                  value={form.aliases}
                  onChange={(event) => updateForm("aliases", event.target.value)}
                  placeholder="comma-separated aliases"
                />
              </label>
              <div className="registry-actions">
                <button type="button" onClick={saveEntry}>
                  {editingId ? "Save changes" : "Add source"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY_FORM);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            <h3>Example-Ready Sources</h3>
            <div className="example-source-grid">
              {FUTURE_SOURCE_EXAMPLES.map((example) => (
                <button key={example.id} type="button" onClick={() => addExample(example)}>
                  {example.label}
                  <span>{formatLabel(example.category)}</span>
                </button>
              ))}
            </div>

            <h3>Import / Export JSON</h3>
            <div className="registry-actions">
              <button type="button" onClick={exportRegistry}>
                Export
              </button>
              <button type="button" onClick={importRegistry}>
                Import
              </button>
            </div>
            <textarea
              value={registryJson}
              onChange={(event) => setRegistryJson(event.target.value)}
              placeholder="Registry JSON import/export"
            />
            {message ? <p className="registry-message">{message}</p> : null}
          </section>
        </div>
      </section>
    </div>
  );
}

function parseAliases(value: string, id: string): string[] {
  return Array.from(
    new Set([
      id,
      ...value
        .split(",")
        .map((alias) => alias.trim())
        .filter(Boolean)
    ])
  );
}

function cleanId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
