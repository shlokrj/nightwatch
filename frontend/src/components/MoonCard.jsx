export default function MoonCard({ moon }) {
  return (
    <div className="rounded-xl bg-night-800 border border-night-700 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-3">Moon</h3>
      <p className="text-2xl font-semibold text-slate-100">{moon.phase}</p>
      <p className="text-slate-400 mt-1">{moon.illumination}% illuminated</p>
      <div className="mt-4 flex gap-6 text-sm text-slate-400">
        {moon.rise && <span>Rise: <span className="text-slate-200">{moon.rise}</span></span>}
        {moon.set && <span>Set: <span className="text-slate-200">{moon.set}</span></span>}
      </div>
    </div>
  );
}
