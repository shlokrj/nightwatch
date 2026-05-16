const BASE = "/api/sky";

export async function fetchSkyReport(city, date) {
  const params = new URLSearchParams({ city });
  if (date) params.set("target_date", date);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (userTimezone) params.set("user_timezone", userTimezone);

  const res = await fetch(`${BASE}/report?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}
