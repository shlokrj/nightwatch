import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
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
    <div className="relative min-h-screen overflow-hidden bg-night-950 text-stellar-pearl">
      <Analytics />
      <StarField />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center gap-10 px-5 pb-20 pt-12 sm:gap-12 sm:pt-16">
        <header className="w-full text-center">
          <p className="font-elegant text-xl font-semibold text-stellar-gold/90 sm:text-2xl">
            Your stargazing guide
          </p>
          <h1
            className="wordmark mt-3 text-6xl sm:text-8xl"
            aria-label="Nightwatch"
          >
            Nightwatch
          </h1>
          <div className="wordmark-rule" />
          <p className="mx-auto mt-5 max-w-xl text-base font-light leading-7 text-slate-200/80 sm:text-lg">
            What's in the sky tonight?
          </p>
        </header>

        <LocationSearch onSearch={handleSearch} loading={loading} />

        {error && (
          <p className="quiet-panel rounded-lg px-4 py-3 text-sm font-medium text-rose-200">
            {error}
          </p>
        )}

        {report && <SkyReport report={report} />}
      </div>
    </div>
  );
}
