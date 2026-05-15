export default function MoonCard({ moon }) {
  const illumination = Math.max(0, Math.min(100, Number(moon.illumination) || 0));

  return (
    <section className="glass-panel grid gap-6 rounded-xl p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
      <div
        className="moon-orb mx-auto sm:mx-0"
        style={{ "--moon-shadow": (100 - illumination) / 100 }}
      />

      <div>
        <h3 className="font-elegant text-2xl font-semibold text-stellar-gold/90">Moon</h3>
        <p className="mt-2 text-3xl font-semibold text-stellar-pearl">{moon.phase}</p>
        <p className="mt-1 text-slate-200/70">{moon.illumination}% illuminated</p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-200/70">
          {moon.rise && (
            <span className="rounded-full border border-stellar-pearl/10 bg-stellar-pearl/10 px-4 py-2">
              Rise <span className="font-semibold text-stellar-pearl">{moon.rise}</span>
            </span>
          )}
          {moon.set && (
            <span className="rounded-full border border-stellar-pearl/10 bg-stellar-pearl/10 px-4 py-2">
              Set <span className="font-semibold text-stellar-pearl">{moon.set}</span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
