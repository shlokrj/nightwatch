import MoonCard from "./MoonCard";
import PlanetCard from "./PlanetCard";

export default function SkyReport({ report }) {
  const visiblePlanets = report.planets.filter((p) => p.visible);

  return (
    <div className="w-full max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">{report.city}</h2>
        <p className="text-slate-400 mt-1">{report.date}</p>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-indigo-950 border border-indigo-800 p-5">
        <p className="text-slate-200 leading-relaxed">{report.summary}</p>
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
          <div key={label} className="rounded-lg bg-night-800 border border-night-700 p-4">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
            <p className="text-slate-100 font-medium">{val}</p>
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
