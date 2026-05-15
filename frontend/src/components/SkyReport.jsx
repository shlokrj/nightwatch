import MoonCard from "./MoonCard";
import PlanetCard from "./PlanetCard";

export default function SkyReport({ report }) {
  const visiblePlanets = report.planets.filter((p) => p.visible);

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-3xl font-bold text-cyan-50 drop-shadow-md">{report.city}</h2>
        <p className="text-cyan-200/60 mt-1 uppercase tracking-widest text-sm">{report.date}</p>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-indigo-900/30 backdrop-blur-md border border-indigo-500/20 p-6 shadow-[0_0_30px_rgba(79,70,229,0.15)]">
        <p className="text-indigo-100 leading-relaxed text-lg font-light">{report.summary}</p>
      </div>

      {/* Sun & Twilight */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          ["Sunset", report.sunset],
          ["Civil Twilight", report.civil_twilight_end],
          ["Nautical Twilight", report.nautical_twilight_end],
          ["Astronomical Twilight", report.astronomical_twilight_end],
          ["Sunrise", report.sunrise],
        ].map(([label, val]) => (
          <div key={label} className="rounded-xl bg-night-900/40 backdrop-blur-sm border border-white/10 p-4 hover:bg-night-800/50 transition-colors">
            <p className="text-xs uppercase tracking-wider text-cyan-200/50 mb-1">{label}</p>
            <p className="text-cyan-50 font-medium">{val}</p>
          </div>
        ))}
      </div>

      {/* Moon */}
      <MoonCard moon={report.moon} />

      {/* Planets */}
      {visiblePlanets.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Visible Planets
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visiblePlanets.map((p) => (
              <PlanetCard key={p.name} planet={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
