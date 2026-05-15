import { useState } from "react";
import LocationSearch from "./components/LocationSearch";
import SkyReport from "./components/SkyReport";
import StarField from "./components/StarField";
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
    <div className="relative min-h-screen">
      <StarField />

      <div className="relative z-10 px-4 py-16 flex flex-col items-center gap-12">
        <header className="text-center">
          <h1 className="text-5xl font-bold tracking-widest text-white uppercase"
              style={{ letterSpacing: "0.2em", textShadow: "0 0 40px rgba(139,92,246,0.6)" }}>
            Nightwatch
          </h1>
          <p className="text-slate-400 mt-3 text-lg tracking-wide">
            What's in the sky tonight?
          </p>
        </header>

        <LocationSearch onSearch={handleSearch} loading={loading} />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {report && <SkyReport report={report} />}
      </div>
    </div>
  );
}
