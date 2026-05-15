from datetime import date, datetime, timezone
from skyfield.api import load, wgs84, N, E
from skyfield import almanac

# Skyfield timescale and ephemeris (loaded once at module level)
_ts = load.timescale()
_eph = load("de421.bsp")

PLANETS = ["venus", "mars", "jupiter barycenter", "saturn barycenter", "mercury"]

DIRECTION_LABELS = [
    (22.5, "N"), (67.5, "NE"), (112.5, "E"), (157.5, "SE"),
    (202.5, "S"), (247.5, "SW"), (292.5, "W"), (337.5, "NW"), (360.0, "N"),
]


def _azimuth_to_direction(az: float) -> str:
    for threshold, label in DIRECTION_LABELS:
        if az < threshold:
            return label
    return "N"


def _fmt_time(t) -> str:
    dt = t.utc_datetime().astimezone()
    return dt.strftime("%-I:%M %p")


def get_sky_report(lat: float, lon: float, target_date: date) -> dict:
    observer = wgs84.latlon(lat * N, lon * E)

    # Build a time window covering the full day
    t0 = _ts.utc(target_date.year, target_date.month, target_date.day, 0)
    t1 = _ts.utc(target_date.year, target_date.month, target_date.day + 1, 0)

    # --- Sun events ---
    sun_times, sun_events = almanac.find_discrete(t0, t1, almanac.sunrise_sunset(_eph, observer))
    sunset = sunrise = None
    for t, e in zip(sun_times, sun_events):
        if e == 1 and sunrise is None:
            sunrise = _fmt_time(t)
        if e == 0:
            sunset = _fmt_time(t)

    # --- Twilight ---
    twilight_fn = almanac.dark_twilight_day(_eph, observer)
    twi_times, twi_events = almanac.find_discrete(t0, t1, twilight_fn)

    civil_end = nautical_end = astro_end = None
    for t, e in zip(twi_times, twi_events):
        # events go 4→3→2→1→0 (day→civil→nautical→astro→night)
        if e == 3 and civil_end is None:
            civil_end = _fmt_time(t)
        if e == 2 and nautical_end is None:
            nautical_end = _fmt_time(t)
        if e == 1 and astro_end is None:
            astro_end = _fmt_time(t)

    # --- Moon ---
    moon = _eph["moon"]
    earth = _eph["earth"]
    t_mid = _ts.utc(target_date.year, target_date.month, target_date.day, 21)  # 9 PM local approx
    astrometric = (earth + observer).at(t_mid).observe(moon)
    alt, az, _ = astrometric.apparent().altaz()

    moon_phase_angle = almanac.moon_phase(_eph, t_mid).degrees
    illumination = round((1 - abs(moon_phase_angle - 180) / 180) * 100, 1)
    phase_name = _moon_phase_name(moon_phase_angle)

    moon_rise_set = almanac.find_discrete(t0, t1, almanac.risings_and_settings(_eph, moon, observer))
    moon_rise = moon_set = None
    for t, e in zip(*moon_rise_set):
        if e == 1 and moon_rise is None:
            moon_rise = _fmt_time(t)
        if e == 0 and moon_set is None:
            moon_set = _fmt_time(t)

    moon_info = {
        "phase": phase_name,
        "illumination": illumination,
        "rise": moon_rise,
        "set": moon_set,
        "altitude": round(alt.degrees, 1),
    }

    # --- Planets ---
    planet_data = []
    for planet_name in PLANETS:
        body = _eph[planet_name]
        astr = (earth + observer).at(t_mid).observe(body)
        p_alt, p_az, _ = astr.apparent().altaz()
        visible = p_alt.degrees > 5

        # approximate magnitude (placeholder — replace with actual later)
        mag = _rough_magnitude(planet_name)

        # find best viewing time (highest altitude after sunset)
        best_time = _best_viewing_time(earth, observer, body, t0, t1) if visible else None

        planet_data.append({
            "name": planet_name.replace(" barycenter", "").title(),
            "altitude": round(p_alt.degrees, 1),
            "azimuth": round(p_az.degrees, 1),
            "direction": _azimuth_to_direction(p_az.degrees),
            "magnitude": mag,
            "visible": visible,
            "best_time": best_time,
        })

    summary = _generate_summary(planet_data, moon_info, sunset, astro_end)

    return {
        "sunset": sunset or "N/A",
        "sunrise": sunrise or "N/A",
        "civil_twilight_end": civil_end or "N/A",
        "nautical_twilight_end": nautical_end or "N/A",
        "astronomical_twilight_end": astro_end or "N/A",
        "moon": moon_info,
        "planets": planet_data,
        "summary": summary,
    }


def _best_viewing_time(earth, observer, body, t0, t1) -> str | None:
    times = [t0.tt + i * (t1.tt - t0.tt) / 48 for i in range(48)]
    best_alt = -90
    best_t = None
    for tt in times:
        t = _ts.tt_jd(tt)
        astr = (earth + observer).at(t).observe(body)
        alt, _, _ = astr.apparent().altaz()
        if alt.degrees > best_alt:
            best_alt = alt.degrees
            best_t = t
    if best_alt < 5:
        return None
    return _fmt_time(best_t)


def _rough_magnitude(planet_name: str) -> float:
    defaults = {
        "venus": -4.0,
        "jupiter barycenter": -2.5,
        "mars": 0.5,
        "saturn barycenter": 0.8,
        "mercury": 0.0,
    }
    return defaults.get(planet_name, 1.0)


def _moon_phase_name(phase_angle: float) -> str:
    if phase_angle < 45:
        return "New Moon"
    elif phase_angle < 90:
        return "Waxing Crescent"
    elif phase_angle < 135:
        return "First Quarter"
    elif phase_angle < 180:
        return "Waxing Gibbous"
    elif phase_angle < 225:
        return "Full Moon"
    elif phase_angle < 270:
        return "Waning Gibbous"
    elif phase_angle < 315:
        return "Last Quarter"
    else:
        return "Waning Crescent"


def _generate_summary(planets: list, moon: dict, sunset: str | None, astro_end: str | None) -> str:
    parts = []

    if sunset:
        parts.append(f"Sunset is at {sunset}.")

    if astro_end:
        parts.append(f"True darkness begins after astronomical twilight ends at {astro_end}.")

    moon_line = f"The Moon is {moon['phase'].lower()} ({moon['illumination']}% illuminated)"
    if moon["rise"]:
        moon_line += f", rising at {moon['rise']}"
    moon_line += "."
    parts.append(moon_line)

    visible = [p for p in planets if p["visible"]]
    if visible:
        planet_lines = []
        for p in visible:
            planet_lines.append(f"{p['name']} in the {p['direction'].lower()}ern sky")
        parts.append("Tonight you can see: " + ", ".join(planet_lines) + ".")
    else:
        parts.append("No bright planets are well-placed for viewing tonight.")

    return " ".join(parts)
