from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import sky

app = FastAPI(title="Nightwatch API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sky.router)


@app.get("/health")
def health():
    return {"status": "ok"}
