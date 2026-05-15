import { useState } from "react";

export default function LocationSearch({ onSearch, loading }) {
  const [city, setCity] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (city.trim()) onSearch(city.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel flex w-full max-w-2xl flex-col gap-3 rounded-xl p-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="city-search">
        City
      </label>
      <input
        id="city-search"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city, e.g. San Francisco, CA"
        autoComplete="address-level2"
        className="input-glow min-h-14 flex-1 rounded-lg border border-stellar-pearl/10 bg-night-950/75 px-4 text-base text-stellar-pearl placeholder:text-slate-400/70 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="gold-button min-h-14 rounded-lg px-7 text-sm font-bold uppercase transition"
      >
        {loading ? "Scanning..." : "Observe"}
      </button>
    </form>
  );
}
