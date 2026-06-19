import type { ViewMode } from "../graph-types.ts";

type Props = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onOpenRegistry: () => void;
};

const MODES: Array<{ id: ViewMode; label: string; placeholder?: boolean }> = [
  { id: "global", label: "Global View" },
  { id: "source", label: "Source View" },
  { id: "project", label: "Project View" },
  { id: "cleanup", label: "Cleanup View", placeholder: true },
  { id: "dream", label: "Dream View", placeholder: true }
];

export default function TopCommandBar({ mode, onModeChange, onOpenRegistry }: Props) {
  return (
    <header className="top-command-bar">
      <div className="brand-lockup">
        <span className="brand-orb" aria-hidden="true" />
        <div>
          <h1>devdevbuilds Ghost Brain</h1>
          <p>source-aware 3D Obsidian memory interface</p>
        </div>
      </div>

      <nav className="mode-switcher" aria-label="View modes">
        {MODES.map((item) => (
          <button
            key={item.id}
            className={item.id === mode ? "active" : ""}
            type="button"
            onClick={() => onModeChange(item.id)}
            title={item.placeholder ? "Placeholder mode for this phase" : item.label}
          >
            {item.label}
          </button>
        ))}
        <button type="button" onClick={onOpenRegistry}>
          Sources & Models
        </button>
      </nav>
    </header>
  );
}
