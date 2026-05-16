import { useEffect, useMemo, useState } from "react";
import MoonCard from "./MoonCard";
import PlanetCard from "./PlanetCard";

const DIRECTION_PHRASES = {
  N: "northern",
  NE: "northeastern",
  E: "eastern",
  SE: "southeastern",
  S: "southern",
  SW: "southwestern",
  W: "western",
  NW: "northwestern",
};

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

function formatReportTime(timestamp, timezone, fallback = "N/A") {
  if (!timestamp || !timezone) return fallback;

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
      timeZoneName: "short",
    }).format(parsed);
  } catch {
    return fallback;
  }
}

function generateSummary(moon, planets, times) {
  const parts = [];

  if (times.sunset && times.sunset !== "N/A") {
    parts.push(`Sunset is at ${times.sunset}.`);
  }

  if (times.astronomicalTwilightEnd && times.astronomicalTwilightEnd !== "N/A") {
    parts.push(
      `True darkness begins after astronomical twilight ends at ${times.astronomicalTwilightEnd}.`,
    );
  }

  let moonLine = `The Moon is ${moon.phase.toLowerCase()} (${moon.illumination}% illuminated)`;
  if (moon.rise) {
    moonLine += `, rising at ${moon.rise}`;
  }
  moonLine += ".";
  parts.push(moonLine);

  const visiblePlanets = planets.filter((planet) => planet.visible);
  if (visiblePlanets.length > 0) {
    const planetLines = visiblePlanets.map((planet) => {
      const direction = DIRECTION_PHRASES[planet.direction] ?? planet.direction.toLowerCase();
      return `${planet.name} in the ${direction} sky`;
    });
    parts.push(`Tonight you can see: ${planetLines.join(", ")}.`);
  } else {
    parts.push("No bright planets are well-placed for viewing tonight.");
  }

  return parts.join(" ");
}

export default function SkyReport({ report }) {
  const [timeMode, setTimeMode] = useState("place");

  useEffect(() => {
    setTimeMode("place");
  }, [report]);

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
  const selectedTimezone =
    timeMode === "user" && report.user_timezone ? report.user_timezone : report.place_timezone;

  const displayedTimes = useMemo(
    () => ({
      sunset: formatReportTime(report.sunset_at, selectedTimezone, report.sunset),
      sunrise: formatReportTime(report.sunrise_at, selectedTimezone, report.sunrise),
      civilTwilightEnd: formatReportTime(
        report.civil_twilight_end_at,
        selectedTimezone,
        report.civil_twilight_end,
      ),
      nauticalTwilightEnd: formatReportTime(
        report.nautical_twilight_end_at,
        selectedTimezone,
        report.nautical_twilight_end,
      ),
      astronomicalTwilightEnd: formatReportTime(
        report.astronomical_twilight_end_at,
        selectedTimezone,
        report.astronomical_twilight_end,
      ),
    }),
    [report, selectedTimezone],
  );

  const displayedMoon = useMemo(
    () => ({
      ...report.moon,
      rise: formatReportTime(report.moon.rise_at, selectedTimezone, report.moon.rise),
      set: formatReportTime(report.moon.set_at, selectedTimezone, report.moon.set),
    }),
    [report.moon, selectedTimezone],
  );

  const displayedPlanets = useMemo(
    () =>
      report.planets.map((planet) => ({
        ...planet,
        best_time: formatReportTime(planet.best_time_at, selectedTimezone, planet.best_time),
      })),
    [report.planets, selectedTimezone],
  );
  const visiblePlanets = displayedPlanets.filter((planet) => planet.visible);
  const summary = generateSummary(displayedMoon, displayedPlanets, displayedTimes);

  const timeOptions = [
    {
      id: "place",
      label: "Place time",
      value: placeTime,
    },
    report.user_timezone && {
      id: "user",
      label: "Your time",
      value: sameTimezone ? "same" : userTime,
    },
  ].filter(Boolean);

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
        <div className="mt-4 flex flex-wrap gap-2 text-sm" role="group" aria-label="Time display">
          {timeOptions.map((option) => {
            const selected = option.id === timeMode;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setTimeMode(option.id)}
                className={`rounded-full border px-3 py-1 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-stellar-gold/70 ${
                  selected
                    ? "border-stellar-gold/60 bg-stellar-gold/20 text-stellar-gold shadow-[0_0_22px_rgba(236,196,104,0.16)]"
                    : "border-stellar-pearl/10 bg-stellar-pearl/5 text-slate-200/65 hover:border-stellar-gold/35 hover:text-stellar-pearl"
                }`}
              >
                {option.label}:{" "}
                <span className={selected ? "text-stellar-pearl" : "text-stellar-pearl/90"}>
                  {option.value}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-6 max-w-4xl text-lg font-light leading-8 text-slate-100/80">
          {summary}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Sunset", displayedTimes.sunset],
          ["Civil", displayedTimes.civilTwilightEnd],
          ["Nautical", displayedTimes.nauticalTwilightEnd],
          ["Astronomical", displayedTimes.astronomicalTwilightEnd],
          ["Sunrise", displayedTimes.sunrise],
        ].map(([label, val]) => (
          <TimeCard key={label} label={label} value={val} />
        ))}
      </section>

      <MoonCard moon={displayedMoon} />

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
