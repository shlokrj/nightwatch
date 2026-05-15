import MoonCard from "./MoonCard";
import PlanetCard from "./PlanetCard";

function TimeCard({ label, value }) {
  return (
    <div className="quiet-panel rounded-lg p-4">
      <p className="text-sm font-medium text-stellar-gold/70">{label}</p>
      <p className="mt-2 text-xl font-semibold text-stellar-pearl">{value}</p>
    </div>
  );
}

export default function SkyReport({ report }) {
  const visiblePlanets = report.planets.filter((p) => p.visible);

  return (
    <div className="w-full max-w-5xl space-y-6">
      <section className="glass-panel rounded-xl p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-elegant text-xl font-semibold text-stellar-gold/90">
              Observation
            </p>
            <h2 className="mt-1 font-elegant text-4xl font-semibold text-stellar-pearl sm:text-5xl">
              {report.city}
            </h2>
          </div>
          <p className="rounded-full border border-stellar-pearl/10 bg-stellar-pearl/10 px-4 py-2 text-sm font-medium text-slate-200/80">
            {report.date}
          </p>
        </div>
        <p className="mt-6 max-w-4xl text-lg font-light leading-8 text-slate-100/80">
          {report.summary}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Sunset", report.sunset],
          ["Civil", report.civil_twilight_end],
          ["Nautical", report.nautical_twilight_end],
          ["Astronomical", report.astronomical_twilight_end],
          ["Sunrise", report.sunrise],
        ].map(([label, val]) => (
          <TimeCard key={label} label={label} value={val} />
        ))}
      </section>

      <MoonCard moon={report.moon} />

      {visiblePlanets.length > 0 && (
        <section>
          <h3 className="mb-3 font-elegant text-2xl font-semibold text-stellar-gold/90">
            Visible Planets
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visiblePlanets.map((p) => (
              <PlanetCard key={p.name} planet={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
