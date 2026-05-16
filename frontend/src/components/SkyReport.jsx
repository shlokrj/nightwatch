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

function formatReportDate(date) {
  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimezoneName(timezone) {
  if (!timezone) return "Unknown";
  const city = timezone.split("/").pop();
  return city ? city.replaceAll("_", " ") : timezone;
}

function formatTimezoneLabel(timezone, abbreviation) {
  if (!timezone) return "Unknown";

  const examplePlace = formatTimezoneName(timezone);
  if (!abbreviation || abbreviation === examplePlace) {
    return examplePlace;
  }

  return `${abbreviation} (e.g. ${examplePlace})`;
}

export default function SkyReport({ report }) {
  const visiblePlanets = report.planets.filter((p) => p.visible);
  const displayDate = formatReportDate(report.date);
  const placeTime = formatTimezoneLabel(
    report.place_timezone,
    report.place_timezone_abbreviation,
  );
  const userTime = formatTimezoneLabel(
    report.user_timezone,
    report.user_timezone_abbreviation,
  );
  const sameTimezone = report.place_timezone === report.user_timezone;

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
          <p className="rounded-full border border-stellar-gold/35 bg-stellar-gold/10 px-4 py-2 text-sm font-semibold text-stellar-gold">
            {displayDate}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-200/65">
          <span className="rounded-full border border-stellar-pearl/10 bg-stellar-pearl/5 px-3 py-1">
            Place time: <span className="text-stellar-pearl">{placeTime}</span>
          </span>
          {report.user_timezone && (
            <span className="rounded-full border border-stellar-pearl/10 bg-stellar-pearl/5 px-3 py-1">
              Your time: <span className="text-stellar-pearl">{sameTimezone ? "same" : userTime}</span>
            </span>
          )}
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
