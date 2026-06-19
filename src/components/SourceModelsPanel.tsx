import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { FUTURE_SOURCE_EXAMPLES } from "../source-registry-defaults.ts";
import { exportSourceRegistry, importSourceRegistry } from "../source-registry-storage.ts";
import type { SourceCategory, SourceRegistryEntry } from "../source-registry-types.ts";
import { SOURCE_CATEGORIES } from "../source-registry-types.ts";

type Props = {
  entries: SourceRegistryEntry[];
  defaultIds: Set<string>;
  onChange: (entries: SourceRegistryEntry[]) => void;
  onReset: () => void;
  onClose: () => void;
};

type FormState = {
  id: string;
  name: string;
  category: SourceCategory;
  description: string;
  color: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  category: "LLM",
  description: "",
  color: "#00d4ff"
};

export default function SourceModelsPanel({ entries, defaultIds, onChange, onReset, onClose }: Props) {
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
    const now = new Date().toISOString();
    const id = cleanId(form.id || form.name);
    const existing = entries.find((entry) => entry.id === editingId || entry.id === id);
    const duplicateId = entries.find((entry) => entry.id === id && entry.id !== editingId);
    const duplicateName = entries.find(
      (entry) => entry.name.toLowerCase() === form.name.trim().toLowerCase() && entry.id !== editingId
    );

    if (!id || !form.name.trim()) {
      setMessage("Source id and name are required.");
      return;
    }

    if (duplicateId) {
      setMessage(`Source id "${id}" already exists. Choose a different id or edit the existing entry.`);
      return;
    }

    if (duplicateName) {
      setMessage(`Source name "${form.name.trim()}" already exists. Duplicate names are not saved.`);
      return;
    }

    const nextEntry: SourceRegistryEntry = {
      id,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      color: /^#[0-9a-fA-F]{6}$/.test(form.color) ? form.color : "#666666",
      enabled: existing?.enabled ?? true,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };
    const withoutEdited = entries.filter((entry) => entry.id !== (editingId ?? id));

    onChange([...withoutEdited, nextEntry].sort((a, b) => a.name.localeCompare(b.name)));
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("Registry entry saved.");
  }

  function editEntry(entry: SourceRegistryEntry) {
    setEditingId(entry.id);
    setForm({
      id: entry.id,
      name: entry.name,
      category: entry.category,
      description: entry.description,
      color: entry.color
    });
    setMessage(null);
  }

  function toggleEnabled(entry: SourceRegistryEntry) {
    const now = new Date().toISOString();
    onChange(
      entries.map((item) =>
        item.id === entry.id ? { ...item, enabled: !item.enabled, updatedAt: now } : item
      )
    );
  }

  function deleteEntry(entry: SourceRegistryEntry) {
    if (defaultIds.has(entry.id)) {
      setMessage("Default registry entries cannot be deleted. Disable them instead.");
      return;
    }

    onChange(entries.filter((item) => item.id !== entry.id));
    if (editingId === entry.id) {
      setEditingId(null);
      setForm(EMPTY_FORM);
    }
    setMessage(`${entry.name} deleted.`);
  }

  function addExample(example: SourceRegistryEntry) {
    if (entries.some((entry) => entry.id === example.id)) {
      editEntry(entries.find((entry) => entry.id === example.id)!);
      return;
    }

    const now = new Date().toISOString();
    onChange(
      [...entries, { ...example, createdAt: now, updatedAt: now }].sort((a, b) => a.name.localeCompare(b.name))
    );
    setMessage(`${example.name} added to the registry.`);
  }

  function exportRegistry() {
    setRegistryJson(exportSourceRegistry(entries));
    setMessage(`Exported ${entries.length} registry entries below.`);
  }

  function importRegistry() {
    if (!registryJson.trim()) {
      setMessage("Paste registry JSON before importing.");
      return;
    }

    try {
      const imported = importSourceRegistry(registryJson);
      onChange(imported);
      setMessage(`Imported ${imported.length} registry entries.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registry import failed.");
    }
  }

  function resetDefaults() {
    onReset();
    setEditingId(null);
    setForm(EMPTY_FORM);
    setRegistryJson("");
    setMessage("Registry reset to the default sources.");
  }

  return (
    <div className="registry-overlay" role="dialog" aria-modal="true" aria-label="Sources and models registry">
      <section className="registry-panel panel">
        <div className="registry-header">
          <div>
            <h2>Sources & Models</h2>
            <p>Manage source identities for LLM, code, image, music, video, audio, research, local, manual, and unknown sources.</p>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="registry-grid">
          <section className="registry-list">
            <div className="registry-section-heading">
              <h3>Registry</h3>
              <button type="button" onClick={resetDefaults}>
                Reset defaults
              </button>
            </div>

            <div className="category-summary">
              {SOURCE_CATEGORIES.map((category) => (
                <span key={category}>
                  {category}: {categoryCounts.get(category) ?? 0}
                </span>
              ))}
            </div>

            <div className="registry-entry-list">
              {entries.length === 0 ? (
                <p className="registry-empty">No registry entries are available. Reset defaults to restore built-in sources.</p>
              ) : null}
              {entries.map((entry) => (
                <article key={entry.id} className={`registry-entry ${entry.enabled ? "" : "disabled"}`}>
                  <span
                    className="source-dot"
                    style={{ "--source-color": entry.color } as CSSProperties & Record<"--source-color", string>}
                  />
                  <div>
                    <strong>{entry.name}</strong>
                    <small>
                      {entry.id} / {entry.category}
                    </small>
                  </div>
                  <button type="button" onClick={() => toggleEnabled(entry)}>
                    {entry.enabled ? "Enabled" : "Disabled"}
                  </button>
                  <button type="button" onClick={() => editEntry(entry)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteEntry(entry)} disabled={defaultIds.has(entry.id)}>
                    Delete
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="registry-editor">
            <h3>{editingId ? "Edit Source" : "Add Source"}</h3>
            <div className="registry-form">
              <label>
                Name
                <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
              </label>
              <label>
                ID
                <input
                  value={form.id}
                  onChange={(event) => updateForm("id", event.target.value)}
                  placeholder="auto-generated from name if blank"
                />
              </label>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) => updateForm("category", event.target.value as SourceCategory)}
                >
                  {SOURCE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Color
                <input type="color" value={form.color} onChange={(event) => updateForm("color", event.target.value)} />
              </label>
              <label>
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="What kind of source/model is this?"
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
                  {example.name}
                  <span>{example.category}</span>
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

function cleanId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
