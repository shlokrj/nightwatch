from pydantic import BaseModel


class PlanetInfo(BaseModel):
    name: str
    altitude: float
    azimuth: float
    direction: str
    magnitude: float
    visible: bool
    best_time: str | None = None


class MoonInfo(BaseModel):
    phase: str
    illumination: float
    rise: str | None
    set: str | None
    altitude: float


class SkyReport(BaseModel):
    city: str
    date: str
    latitude: float
    longitude: float
    sunset: str
    sunrise: str
    civil_twilight_end: str
    nautical_twilight_end: str
    astronomical_twilight_end: str
    moon: MoonInfo
    planets: list[PlanetInfo]
    summary: str
