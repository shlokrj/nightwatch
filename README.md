# Nightwatch

A local night sky guide where you can enter any city and get a personalized astronomy report for tonight: visible planets, moon phase, twilight times, and a simple English summary of what to look for.

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Python · FastAPI · Skyfield · geopy |
| Frontend | React · Vite · Tailwind CSS |

## Project structure

```
nightwatch/
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   ├── routers/sky.py        # /api/sky/report endpoint
│   ├── services/
│   │   ├── astronomy.py      # Skyfield calculations
│   │   └── geocoding.py      # City → lat/lon via geopy
│   └── models/sky.py         # Pydantic response models
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api/sky.js         # fetch wrapper
    │   └── components/
    │       ├── LocationSearch.jsx
    │       ├── SkyReport.jsx
    │       ├── MoonCard.jsx
    │       └── PlanetCard.jsx
    └── index.html
```

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

## Deployment

> Work in progress: planning to deploy as a live website.
