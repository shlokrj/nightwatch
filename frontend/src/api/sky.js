const BASE = "/api/sky";
const reportCache = new Map();

function getBrowserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
}

export async function fetchSkyReport(city, date) {
  const params = new URLSearchParams({ city });
  if (date) params.set("target_date", date);
  const userTimezone = getBrowserTimezone();
  if (userTimezone) params.set("user_timezone", userTimezone);

  const cacheKey = `${city.toLowerCase()}|${date || ""}|${userTimezone || ""}`;
  if (reportCache.has(cacheKey)) {
    return reportCache.get(cacheKey);
  }

  const res = await fetch(`${BASE}/report?${params}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    const retryAfter = res.headers.get("Retry-After");
    const retryMessage = retryAfter ? ` Try again in ${retryAfter} seconds.` : "";
    throw new Error(`${err.detail || `HTTP ${res.status}`}${retryMessage}`);
  }

  const report = await res.json();
  reportCache.set(cacheKey, report);
  return report;
}
