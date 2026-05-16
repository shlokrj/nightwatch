from functools import lru_cache
import os

import httpx
from geopy.exc import GeocoderServiceError as GeopyServiceError
from geopy.exc import GeocoderTimedOut
from geopy.extra.rate_limiter import RateLimiter
from geopy.geocoders import Nominatim


OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
USER_AGENT = os.getenv("GEOCODING_USER_AGENT", "nightwatch-app/0.1")
US_STATE_HINTS = {
    "al": "alabama",
    "ak": "alaska",
    "az": "arizona",
    "ar": "arkansas",
    "ca": "california",
    "co": "colorado",
    "ct": "connecticut",
    "de": "delaware",
    "fl": "florida",
    "ga": "georgia",
    "hi": "hawaii",
    "id": "idaho",
    "il": "illinois",
    "in": "indiana",
    "ia": "iowa",
    "ks": "kansas",
    "ky": "kentucky",
    "la": "louisiana",
    "me": "maine",
    "md": "maryland",
    "ma": "massachusetts",
    "mi": "michigan",
    "mn": "minnesota",
    "ms": "mississippi",
    "mo": "missouri",
    "mt": "montana",
    "ne": "nebraska",
    "nv": "nevada",
    "nh": "new hampshire",
    "nj": "new jersey",
    "nm": "new mexico",
    "ny": "new york",
    "nc": "north carolina",
    "nd": "north dakota",
    "oh": "ohio",
    "ok": "oklahoma",
    "or": "oregon",
    "pa": "pennsylvania",
    "ri": "rhode island",
    "sc": "south carolina",
    "sd": "south dakota",
    "tn": "tennessee",
    "tx": "texas",
    "ut": "utah",
    "vt": "vermont",
    "va": "virginia",
    "wa": "washington",
    "wv": "west virginia",
    "wi": "wisconsin",
    "wy": "wyoming",
    "dc": "district of columbia",
}
US_STATE_NAMES = set(US_STATE_HINTS.values())
COUNTRY_HINTS = {
    "u s": "united states",
    "u s a": "united states",
    "us": "united states",
    "usa": "united states",
    "united states of america": "united states",
    "uk": "united kingdom",
}


class LocationNotFoundError(ValueError):
    pass


class GeocodingServiceError(ValueError):
    def __init__(self, message: str, retry_after: int | None = None):
        super().__init__(message)
        self.retry_after = retry_after


_nominatim = Nominatim(user_agent=USER_AGENT)
_nominatim_geocode = RateLimiter(
    _nominatim.geocode,
    min_delay_seconds=1.1,
    max_retries=2,
    error_wait_seconds=2.0,
    swallow_exceptions=False,
)


def geocode_city(city: str) -> tuple[float, float, str]:
    """
    Returns (latitude, longitude, display_name) for a city string.
    Raises ValueError if the city cannot be found.
    """
    query = _normalize_city(city)
    if not query:
        raise LocationNotFoundError("Please enter a city.")

    return _geocode_city_cached(query)


def _normalize_city(city: str) -> str:
    return " ".join(city.strip().split())


@lru_cache(maxsize=512)
def _geocode_city_cached(city: str) -> tuple[float, float, str]:
    try:
        return _geocode_with_open_meteo(city)
    except LocationNotFoundError as open_meteo_not_found:
        if not _should_try_nominatim_fallback(city):
            raise
        try:
            return _geocode_with_nominatim(city)
        except LocationNotFoundError:
            raise open_meteo_not_found
    except GeocodingServiceError as open_meteo_error:
        try:
            return _geocode_with_nominatim(city)
        except LocationNotFoundError:
            raise
        except GeocodingServiceError:
            raise open_meteo_error


def _geocode_with_open_meteo(city: str) -> tuple[float, float, str]:
    search_terms = [city]
    location_parts = _location_parts(city)
    if len(location_parts) > 1:
        search_terms.append(location_parts[0])

    for search_term in search_terms:
        results = _fetch_open_meteo_results(search_term)
        result = _select_open_meteo_result(results, location_parts)
        if result:
            return result["latitude"], result["longitude"], _format_open_meteo_display_name(result)

    raise LocationNotFoundError(f"Could not find location: {city}")


def _fetch_open_meteo_results(search_term: str) -> list[dict]:
    try:
        response = httpx.get(
            OPEN_METEO_GEOCODING_URL,
            params={"name": search_term, "count": 10, "language": "en", "format": "json"},
            headers={"User-Agent": USER_AGENT},
            timeout=8,
        )
    except httpx.TimeoutException as e:
        raise GeocodingServiceError("Geocoding service timed out. Please try again.") from e
    except httpx.HTTPError as e:
        raise GeocodingServiceError("Geocoding service is unavailable. Please try again.") from e

    if response.status_code == 429:
        retry_after = _retry_after_seconds(response)
        raise GeocodingServiceError(
            "Geocoding is temporarily rate limited. Please try again shortly.",
            retry_after=retry_after,
        )

    try:
        response.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise GeocodingServiceError("Geocoding service is unavailable. Please try again.") from e

    try:
        payload = response.json()
    except ValueError as e:
        raise GeocodingServiceError("Geocoding service returned an invalid response.") from e

    return payload.get("results") or []


def _select_open_meteo_result(results: list[dict], location_parts: list[str]) -> dict | None:
    if not results:
        return None

    hints = [_normalize_location_hint(part) for part in location_parts[1:]]
    first_part = _normalize_location_hint(location_parts[0]) if location_parts else ""
    if first_part in US_STATE_NAMES and "united states" in hints:
        hints.append(first_part)

    if not hints:
        return results[0]

    for result in results:
        location_fields = _open_meteo_location_fields(result)
        if all(hint in location_fields for hint in hints):
            return result

    return None


def _open_meteo_location_fields(result: dict) -> set[str]:
    return {
        _normalize_location_hint(value)
        for value in [
            result.get("country_code"),
            result.get("country"),
            result.get("admin1"),
            result.get("admin2"),
            result.get("admin3"),
            result.get("admin4"),
        ]
        if value
    }


def _location_parts(city: str) -> list[str]:
    return [part.strip() for part in city.split(",") if part.strip()]


def _normalize_location_hint(value: str) -> str:
    normalized = " ".join(value.replace(".", " ").strip().lower().split())
    return US_STATE_HINTS.get(normalized) or COUNTRY_HINTS.get(normalized) or normalized


def _should_try_nominatim_fallback(city: str) -> bool:
    normalized_city = _normalize_location_hint(city)
    return "," in city or normalized_city in US_STATE_NAMES


def _format_open_meteo_display_name(result: dict) -> str:
    parts = [
        result.get("name"),
        result.get("admin1"),
        result.get("country"),
    ]
    unique_parts = []
    for part in parts:
        if part and part not in unique_parts:
            unique_parts.append(part)
    return ", ".join(unique_parts)


def _geocode_with_nominatim(city: str) -> tuple[float, float, str]:
    try:
        location = _nominatim_geocode(city, timeout=10)
    except (GeocoderTimedOut, GeopyServiceError) as e:
        raise GeocodingServiceError("Geocoding service is busy. Please try again in a minute.") from e

    if location is None:
        raise LocationNotFoundError(f"Could not find location: {city}")

    return location.latitude, location.longitude, location.address


def _retry_after_seconds(response: httpx.Response) -> int | None:
    retry_after = response.headers.get("Retry-After")
    if not retry_after:
        return None
    try:
        return max(1, int(retry_after))
    except ValueError:
        return None
