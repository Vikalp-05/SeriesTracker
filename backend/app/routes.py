from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app import tmdb
from app.auth import create_access_token, hash_password, verify_password, get_current_user
from app.database import get_session
from app.models import User, Rating
from app.schemas import UserCreate, UserLogin, UserRead, Token, RatingCreate, RatingRead, Genre, Season, Show

router = APIRouter()

@router.get("/ping")
def ping():
    return {"message": "pong"}

@router.get("/trending")
async def trending(window: str = "day"):
    return await tmdb.get_trending(window)

@router.get("/search")
async def search(query: str):
    return await tmdb.search_shows(query)


@router.get("/genres")
async def genres():
    return await tmdb.get_genres()


@router.get("/discover")
async def discover(genre_id: int):
    return await tmdb.discover_by_genre(genre_id)


@router.get("/tv/{show_id}")
async def show_detail(show_id: int):
    return await tmdb.get_show(show_id)


@router.get("/tv/{show_id}/season/{season_number}")
async def season_detail(show_id: int, season_number: int):
    return await tmdb.get_season(show_id, season_number)


@router.post("/auth/signup", response_model=UserRead)
def signup(payload: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=payload.email, hashed_password=hash_password(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/auth/login", response_model=Token)
def login(payload: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user.id)
    return Token(access_token=token)

@router.post("/ratings", response_model=RatingRead)
def rate_episode(
    payload: RatingCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    existing = session.exec(
        select(Rating).where(
            Rating.user_id == current_user.id,
            Rating.episode_id == payload.episode_id,
        )
    ).first()

    if existing:
        existing.score = payload.score
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    rating = Rating(
        user_id=current_user.id,
        show_id=payload.show_id,
        episode_id=payload.episode_id,
        score=payload.score,
    )
    session.add(rating)
    session.commit()
    session.refresh(rating)
    return rating


@router.get("/ratings/show/{show_id}", response_model=list[RatingRead])
def get_ratings_for_show(
    show_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return session.exec(
        select(Rating).where(
            Rating.user_id == current_user.id,
            Rating.show_id == show_id,
        )
    ).all()