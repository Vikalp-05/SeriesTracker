#User models

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Rating(SQLModel, table=True):

    __table_args__ = (UniqueConstraint("user_id", "episode_id"),)

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    show_id: int      
    episode_id: int
    score: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

