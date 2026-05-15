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
        placeholder="Enter a city, e.g. San Francisco, CA"
        className="flex-1 px-4 py-3 rounded-lg bg-night-800 border border-night-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 font-medium transition-colors"
      >
        {loading ? "Loading…" : "Search"}
      </button>
    </form>
  );
}
