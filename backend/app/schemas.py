from pydantic import BaseModel


class Show(BaseModel):
    id: int
    name: str
    overview: str | None = None
    poster_path: str | None = None
    first_air_date: str | None = None
    vote_average: float | None = None
    genre_ids: list[int] = []


class Genre(BaseModel):
    id: int
    name: str


class Episode(BaseModel):
    id: int
    episode_number: int
    name: str
    overview: str | None = None
    air_date: str | None = None
    still_path: str | None = None
    vote_average: float | None = None


class Season(BaseModel):
    season_number: int
    episodes: list[Episode]