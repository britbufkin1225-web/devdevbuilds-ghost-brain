import type { ViewMode } from "../graph-types.ts";

type Props = {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onOpenRegistry: () => void;
  onOpenAbout: () => void;
};

const MODES: Array<{ id: ViewMode; label: string; placeholder?: boolean }> = [
  { id: "global", label: "Global View" },
  { id: "source", label: "Source View" },
  { id: "project", label: "Project View" },
  { id: "cleanup", label: "Cleanup View", placeholder: true },
  { id: "dream", label: "Dream View", placeholder: true }
];

export default function TopCommandBar({ mode, onModeChange, onOpenRegistry, onOpenAbout }: Props) {
  return (
    <header className="top-command-bar">
      <div className="brand-lockup">
        <img className="brand-icon" src="/brand/ghostbrain-app-icon.png" alt="Ghostbrain app icon" />
        <div className="brand-copy">
          <img className="brand-primary-image" src="/brand/ghostbrain-primary-wide.png" alt="ghost|brain" />
          <h1>ghost|brain</h1>
          <p>A devdevbuilds project.</p>
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
        <button type="button" onClick={onOpenAbout}>
          About
        </button>
      </nav>

      <div className="studio-lockup" aria-label="devdevbuilds">
        <img src="/brand/devdevbuilds-wordmark.png" alt="devdevbuilds" />
      </div>
    </header>
  );
}
