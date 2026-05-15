export default function MoonCard({ moon }) {
  return (
    <div className="rounded-2xl bg-night-900/40 backdrop-blur-md border border-white/10 p-6 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-cyan-200/50 mb-3">Moon</h3>
      <p className="text-3xl font-bold text-white drop-shadow-md">{moon.phase}</p>
      <p className="text-cyan-100/70 mt-1">{moon.illumination}% illuminated</p>
      <div className="mt-4 flex gap-6 text-sm text-cyan-200/60">
        {moon.rise && <span>Rise: <span className="text-cyan-50 font-medium">{moon.rise}</span></span>}
        {moon.set && <span>Set: <span className="text-cyan-50 font-medium">{moon.set}</span></span>}
      </div>
    </div>
  );
}
