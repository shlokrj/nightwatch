from pydantic import BaseModel


class PlanetInfo(BaseModel):
    name: str
    altitude: float
    azimuth: float
    direction: str
    magnitude: float
    visible: bool
    best_time: str | None = None
    best_time_at: str | None = None


class MoonInfo(BaseModel):
    phase: str
    illumination: float
    rise: str | None
    rise_at: str | None = None
    set: str | None
    set_at: str | None = None
    altitude: float


class SkyReport(BaseModel):
    city: str
    date: str
    place_timezone: str
    place_timezone_abbreviation: str
    user_timezone: str | None = None
    user_timezone_abbreviation: str | None = None
    latitude: float
    longitude: float
    sunset: str
    sunset_at: str | None = None
    sunrise: str
    sunrise_at: str | None = None
    civil_twilight_end: str
    civil_twilight_end_at: str | None = None
    nautical_twilight_end: str
    nautical_twilight_end_at: str | None = None
    astronomical_twilight_end: str
    astronomical_twilight_end_at: str | None = None
    moon: MoonInfo
    planets: list[PlanetInfo]
    summary: str
