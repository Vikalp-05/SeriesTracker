#Show Model

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class Show(BaseModel):
    id: int
    name: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    first_air_date: Optional[str] = None
    vote_average: Optional[str]= None
    genre_ids: Optional[list[int]] = []


class Genre(BaseModel):
    id: int
    name: str


class Episode(BaseModel):
    id: int
    episode_number: int
    name: str
    overview: Optional[str] = None
    air_date: Optional[str] = None
    still_path: Optional[str] = None
    vote_average: Optional[float] = None


class Season(BaseModel):
    season_number: int
    episodes: list[Episode]

class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RatingCreate(BaseModel):
    show_id: int
    episode_id: int
    score: int


class RatingRead(BaseModel):
    id: int
    show_id: int
    episode_id: int
    score: int