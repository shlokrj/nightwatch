import { useState } from "react";
import LocationSearch from "./components/LocationSearch";
import SkyReport from "./components/SkyReport";
import { fetchSkyReport } from "./api/sky";

export default function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(city) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSkyReport(city);
      setReport(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-night-950 px-4 py-12 flex flex-col items-center gap-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-100">Nightwatch</h1>
        <p className="text-slate-400 mt-2 text-lg">What's in the sky tonight?</p>
      </header>

      <LocationSearch onSearch={handleSearch} loading={loading} />

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {report && <SkyReport report={report} />}
    </div>
  );
}
