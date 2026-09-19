import os
import time
import httpx

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# memory cache
_cache = {}
CACHE_TTL_SECONDS = 60 * 60 * 3  

#GET request to TMDB
async def _get(path: str, params: dict | None = None):
    
    params = params or {}
    cache_key = f"{path}?{params}"

    cached = _cache.get(cache_key)
    if cached and (time.time() - cached[0]) < CACHE_TTL_SECONDS:
        return cached[1]

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{TMDB_BASE_URL}{path}",
            params={**params, "api_key": TMDB_API_KEY},
        )
        response.raise_for_status()
        data = response.json()

    _cache[cache_key] = (time.time(), data)
    return data


async def get_trending(time_window: str = "week"):
    return await _get(f"/trending/tv/{time_window}")


async def search_shows(query: str):
    return await _get("/search/tv", {"query": query})


async def get_genres():
    return await _get("/genre/tv/list")


async def discover_by_genre(genre_id: int):
    return await _get("/discover/tv", {"with_genres": genre_id})


async def get_show(show_id: int):
    return await _get(f"/tv/{show_id}")


async def get_season(show_id: int, season_number: int):
    return await _get(f"/tv/{show_id}/season/{season_number}")