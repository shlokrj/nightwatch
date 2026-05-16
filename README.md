# Nightwatch

A local night sky guide where you can enter a city, landmark, campus, or address-like place and get a personalized astronomy report for tonight: visible planets, moon phase, twilight times, and a simple English summary of what to look for.

## Deployment

Check it out: https://nightwatch-psi.vercel.app/

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Python, FastAPI, Skyfield, geopy/Nominatim, Open-Meteo fallback, timezonefinder, tzdata |
| Frontend | React, Vite, Tailwind CSS, Vercel Analytics |
| Deployment | Vercel static frontend, FastAPI serverless API rewrite |

## Features

- Place search with Nominatim as the primary geocoder, plus rate limiting, caching, and Open-Meteo fallback.
- Astronomy calculations with Skyfield for sunrise, sunset, twilight, moon data, and visible planets.
- Timezone detection from coordinates with `timezonefinder`.
- Place-time/your-time toggle backed by UTC event timestamps, so report times can be shown in either timezone.
- Readable timezone abbreviations for common zones, with UTC-offset fallback for zones without conventional labels.

## Local development

### Backend

```bash
# from the nightwatch root
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. API requests proxy to `:8000`.
