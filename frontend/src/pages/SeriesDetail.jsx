import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSeasonDetail, getShowDetail } from '../api.js'
import EpisodeRow from '../components/EpisodeRow.jsx'
import RatingBadge from '../components/RatingBadge.jsx'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export default function SeriesDetail() {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loadingShow, setLoadingShow] = useState(true)
  const [loadingEpisodes, setLoadingEpisodes] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoadingShow(true)
    getShowDetail(id)
      .then((data) => {
        setShow(data)
        const firstRealSeason = data.seasons?.find((s) => s.season_number > 0)
        setSelectedSeason(firstRealSeason?.season_number ?? 1)
      })
      .catch(() => setError('Could not load this show.'))
      .finally(() => setLoadingShow(false))
  }, [id])


  useEffect(() => {
    if (selectedSeason == null) return

    setLoadingEpisodes(true)
    getSeasonDetail(id, selectedSeason)
      .then((data) => setEpisodes(data.episodes))
      .catch(() => setError('Could not load episodes for this season.'))
      .finally(() => setLoadingEpisodes(false))
  }, [id, selectedSeason])

  if (loadingShow) {
    return <p style={{ padding: '32px 56px', color: 'var(--muted)' }}>Loading...</p>
  }

  if (error || !show) {
    return <p style={{ padding: '32px 56px', color: 'var(--accent)' }}>{error ?? 'Show not found.'}</p>
  }

  const posterUrl = show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null
  const seasons = (show.seasons ?? []).filter((s) => s.season_number > 0)
  const years = [show.first_air_date?.slice(0, 4), show.last_air_date?.slice(0, 4)]
    .filter(Boolean)
    .join('–')

  return (
    <div>
      <div style={{ padding: '24px 56px 0' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--muted)',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          ← Back to Trending
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '32px',
          padding: '24px 56px 28px',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            width: '220px',
            aspectRatio: '2 / 3',
            flexShrink: 0,
            borderRadius: '12px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}
        >
          {posterUrl && (
            <img src={posterUrl} alt={show.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            justifyContent: 'center',
            minWidth: '280px',
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>{show.name}</h1>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              {years} · {show.number_of_seasons} Season{show.number_of_seasons === 1 ? '' : 's'} ·{' '}
              {show.genres?.map((g) => g.name).join(', ')}
            </div>
          </div>
          <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(245,242,236,0.75)', maxWidth: '620px' }}>
            {show.overview}
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '18px 28px',
            alignSelf: 'center',
          }}
        >
          <RatingBadge rating={show.vote_average?.toFixed(1)} />
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Average Rating
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 56px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {seasons.map((season) => (
          <button
            key={season.season_number}
            onClick={() => setSelectedSeason(season.season_number)}
            style={{
              padding: '9px 20px',
              borderRadius: '999px',
              border: selectedSeason === season.season_number ? 'none' : '1px solid var(--border)',
              background: selectedSeason === season.season_number ? 'var(--accent)' : 'transparent',
              color: selectedSeason === season.season_number ? '#1A140A' : 'var(--muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 56px 40px' }}>
        {loadingEpisodes && <p style={{ color: 'var(--muted)' }}>Loading episodes...</p>}
        {!loadingEpisodes && episodes.map((episode) => <EpisodeRow key={episode.id} episode={episode} />)}
      </div>
    </div>
  )
}