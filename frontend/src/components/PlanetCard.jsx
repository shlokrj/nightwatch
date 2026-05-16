const PLANET_STYLES = {
  Venus: {
    className: "planet-venus",
    color: "#e6c48f",
    highlight: "#fff0c9",
    glow: "rgba(230, 196, 143, 0.34)",
    meterEnd: "#b98f5f",
  },
  Jupiter: {
    className: "planet-jupiter",
    color: "#d9a06a",
    highlight: "#ffe0b6",
    glow: "rgba(217, 160, 106, 0.32)",
    meterEnd: "#b87960",
  },
  Mars: {
    className: "planet-mars",
    color: "#d56d5c",
    highlight: "#ffd0c6",
    glow: "rgba(213, 109, 92, 0.34)",
    meterEnd: "#ad574b",
  },
  Saturn: {
    className: "planet-saturn",
    color: "#d9bd85",
    highlight: "#fff1be",
    glow: "rgba(217, 189, 133, 0.34)",
    meterEnd: "#b79a68",
  },
  Mercury: {
    className: "planet-mercury",
    color: "#b9844f",
    highlight: "#f0c995",
    glow: "rgba(185, 132, 79, 0.26)",
    meterEnd: "#7c583c",
  },
};

export default function PlanetCard({ planet }) {
  if (!planet.visible) return null;

  const style = PLANET_STYLES[planet.name] ?? {
    className: "planet-default",
    color: "#d99a3d",
    highlight: "#fff7cf",
    glow: "rgba(244, 200, 91, 0.22)",
    meterEnd: "#c66d5a",
  };
  const altitude = Math.max(0, Math.min(90, Number(planet.altitude) || 0));
  const altitudeWidth = `${(altitude / 90) * 100}%`;
  const altitudeLabel = `${planet.altitude} degrees above horizon`;

  return (
    <article
      className="quiet-panel rounded-xl p-5"
      style={{
        "--planet-color": style.color,
        "--planet-hi": style.highlight,
        "--planet-glow": style.glow,
        "--planet-meter-end": style.meterEnd,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className={`planet-glyph ${style.className} shrink-0`}
          role="img"
          aria-label={`${planet.name} illustration`}
        >
          <span className="planet-body" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-semibold text-stellar-pearl">{planet.name}</h3>
          <p className="mt-1 text-sm text-slate-200/70">
            {planet.direction} / {altitudeLabel}
          </p>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-200/55">
          <span>Altitude</span>
          <span className="font-semibold text-slate-100/80">{planet.altitude} degrees</span>
        </div>
        <div
          className="planet-meter"
          aria-label={`Altitude meter, ${altitudeLabel}`}
          role="meter"
          aria-valuemin="0"
          aria-valuemax="90"
          aria-valuenow={altitude}
        >
          <span className="planet-meter-fill" style={{ width: altitudeWidth }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[0.68rem] text-slate-300/45">
          <span>Horizon</span>
          <span>Zenith</span>
        </div>
      </div>
      {planet.best_time && (
        <p className="mt-4 text-sm text-slate-200/75">
          Best viewing <span className="font-semibold text-stellar-pearl">{planet.best_time}</span>
        </p>
      )}
    </article>
  );
}
