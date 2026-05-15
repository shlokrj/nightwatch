const PLANET_COLORS = {
  Venus: "text-yellow-300",
  Jupiter: "text-orange-300",
  Mars: "text-red-400",
  Saturn: "text-amber-300",
  Mercury: "text-slate-300",
};

export default function PlanetCard({ planet }) {
  if (!planet.visible) return null;

  const color = PLANET_COLORS[planet.name] ?? "text-slate-200";

  return (
    <div className="rounded-xl bg-night-800 border border-night-700 p-5">
      <h3 className={`text-xl font-semibold ${color}`}>{planet.name}</h3>
      <p className="text-slate-400 mt-1 text-sm">
        {planet.direction} · {planet.altitude}° above horizon
      </p>
      {planet.best_time && (
        <p className="mt-3 text-sm text-slate-300">
          Best viewing: <span className="font-medium">{planet.best_time}</span>
        </p>
      )}
    </div>
  );
}
