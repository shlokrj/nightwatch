from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError


def geocode_city(city: str) -> tuple[float, float, str]:
    """
    Returns (latitude, longitude, display_name) for a city string.
    Raises ValueError if the city cannot be found.
    """
    geolocator = Nominatim(user_agent="nightwatch-app")
    try:
        location = geolocator.geocode(city, timeout=10)
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        raise ValueError(f"Geocoding service error: {e}")

    if location is None:
        raise ValueError(f"Could not find location: {city}")

    return location.latitude, location.longitude, location.address
