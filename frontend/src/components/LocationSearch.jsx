import { useState } from "react";

export default function LocationSearch({ onSearch, loading }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-xl">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city, e.g. Milpitas, CA"
        className="flex-1 px-4 py-3 rounded-xl bg-night-900/40 backdrop-blur-md border border-white/10 text-cyan-50 placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-xl bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 text-indigo-200 hover:bg-indigo-500/30 hover:text-white disabled:opacity-50 font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
      >
        {loading ? "Loading…" : "Search"}
      </button>
    </form>
  );
}
