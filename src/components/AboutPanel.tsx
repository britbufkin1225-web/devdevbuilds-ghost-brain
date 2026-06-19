type Props = {
  onClose: () => void;
};

export default function AboutPanel({ onClose }: Props) {
  return (
    <div className="registry-overlay" role="dialog" aria-modal="true" aria-label="Ghostbrain project identity">
      <section className="about-panel panel">
        <div className="about-brand">
          <img src="/brand/ghostbrain-app-icon.png" alt="Ghostbrain app icon" />
          <div>
            <h2>Ghostbrain</h2>
            <p>A devdevbuilds project.</p>
          </div>
        </div>

        <p className="about-copy">
          A cyber-organic 3D knowledge interface for visualizing notes, sources, models, sessions, and AI-assisted
          memory structures.
        </p>

        <div className="about-source-card" aria-label="devdevbuilds source identity">
          <img src="/brand/devdevbuilds-domain.png" alt="devdevbuilds.com" />
        </div>

        <dl className="about-metadata">
          <div>
            <dt>Phase</dt>
            <dd>4D — Project Branding + GUI Logo Integration</dd>
          </div>
          <div>
            <dt>Studio</dt>
            <dd>devdevbuilds</dd>
          </div>
          <div>
            <dt>Storage</dt>
            <dd>Local-first</dd>
          </div>
          <div>
            <dt>Interface</dt>
            <dd>3D neural knowledge viewer</dd>
          </div>
        </dl>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </section>
    </div>
  );
}
