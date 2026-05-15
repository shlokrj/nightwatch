const PLANET_COLORS = {
  Venus: "text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]",
  Jupiter: "text-orange-300 drop-shadow-[0_0_8px_rgba(253,186,116,0.6)]",
  Mars: "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]",
  Saturn: "text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]",
  Mercury: "text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]",
};

export default function PlanetCard({ planet }) {
  if (!planet.visible) return null;

  const color = PLANET_COLORS[planet.name] ?? "text-cyan-200";

  return (
    <div className="rounded-2xl bg-night-900/40 backdrop-blur-md border border-white/10 p-5 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-night-800/40 transition-colors">
      <h3 className={`text-2xl font-bold tracking-wide ${color}`}>{planet.name}</h3>
      <p className="text-cyan-100/60 mt-1 text-sm">
        {planet.direction} · {planet.altitude}° above horizon
      </p>
      {planet.best_time && (
        <p className="mt-3 text-sm text-cyan-200/80">
          Best viewing: <span className="font-medium text-cyan-50">{planet.best_time}</span>
        </p>
      )}
    </div>
  );
}
