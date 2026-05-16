from datetime import date
from fastapi import APIRouter, HTTPException, Query
from backend.services.geocoding import GeocodingServiceError, LocationNotFoundError, geocode_city
from backend.services.astronomy import get_sky_report
from backend.models.sky import SkyReport

router = APIRouter(prefix="/api/sky", tags=["sky"])


@router.get("/report", response_model=SkyReport)
def sky_report(
    city: str = Query(..., description="City name, e.g. 'Milpitas, CA'"),
    target_date: date | None = Query(default=None, description="Date in YYYY-MM-DD format"),
    user_timezone: str | None = Query(default=None, description="Browser IANA timezone, e.g. America/Los_Angeles"),
):
    try:
        lat, lon, display_name = geocode_city(city)
    except LocationNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except GeocodingServiceError as e:
        headers = {"Retry-After": str(e.retry_after)} if e.retry_after else None
        raise HTTPException(status_code=503, detail=str(e), headers=headers)

    try:
        data = get_sky_report(lat, lon, target_date, user_timezone)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Astronomy calculation error: {e}")

    return SkyReport(
        city=display_name,
        latitude=lat,
        longitude=lon,
        **data,
    )
