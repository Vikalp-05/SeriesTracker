from fastapi import APIRouter, Query

from app import tmdb
from app.schemas import Genre, Season, Show

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.get("/trending", response_model=list[Show])
async def trending(window: str = Query("week", pattern="^(day|week)$")):
    data = await tmdb.get_trending(window)
    return data["results"]

@router.get("/search", response_model=list[Show])
async def search(q: str):
    data = await tmdb.search_shows(q)
    return data["results"]


@router.get("/genres", response_model=list[Genre])
async def genres():
    data = await tmdb.get_genres()
    return data["genres"]


@router.get("/discover", response_model=list[Show])
async def discover(genre_id: int):
    data = await tmdb.discover_by_genre(genre_id)
    return data["results"]


@router.get("/tv/{show_id}")
async def show_detail(show_id: int):
    # Full TMDB payload for now — gets its own schema once the
    # series detail page (build step 4) settles on which fields it needs.
    return await tmdb.get_show(show_id)


@router.get("/tv/{show_id}/season/{season_number}", response_model=Season)
async def season_detail(show_id: int, season_number: int):
    return await tmdb.get_season(show_id, season_number)