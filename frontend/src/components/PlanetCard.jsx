const PLANET_STYLES = {
  Venus: {
    color: "#f3d77d",
    highlight: "#fff5c8",
    glow: "rgba(243, 215, 125, 0.38)",
  },
  Jupiter: {
    color: "#d9a06a",
    highlight: "#ffe0b6",
    glow: "rgba(217, 160, 106, 0.32)",
  },
  Mars: {
    color: "#d56d5c",
    highlight: "#ffd0c6",
    glow: "rgba(213, 109, 92, 0.34)",
  },
  Saturn: {
    color: "#d9bd85",
    highlight: "#fff1be",
    glow: "rgba(217, 189, 133, 0.34)",
  },
  Mercury: {
    color: "#bfc8ca",
    highlight: "#ffffff",
    glow: "rgba(191, 200, 202, 0.28)",
  },
};

export default function PlanetCard({ planet }) {
  if (!planet.visible) return null;

  const style = PLANET_STYLES[planet.name] ?? {
    color: "#ff7adf",
    highlight: "#efffff",
    glow: "rgba(255, 122, 223, 0.3)",
  };
  const altitude = Math.max(0, Math.min(90, Number(planet.altitude) || 0));
  const altitudeWidth = `${Math.max(8, (altitude / 90) * 100)}%`;

  return (
    <article
      className="quiet-panel rounded-xl p-5"
      style={{
        "--planet-color": style.color,
        "--planet-hi": style.highlight,
        "--planet-glow": style.glow,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="planet-glyph shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-semibold text-stellar-pearl">{planet.name}</h3>
          <p className="mt-1 text-sm text-slate-200/70">
            {planet.direction} / {planet.altitude} degrees above horizon
          </p>
        </div>
      </div>
      <div className="planet-meter mt-5">
        <span style={{ width: altitudeWidth }} />
      </div>
      {planet.best_time && (
        <p className="mt-4 text-sm text-slate-200/75">
          Best viewing <span className="font-semibold text-stellar-pearl">{planet.best_time}</span>
        </p>
      )}
    </article>
  );
}
