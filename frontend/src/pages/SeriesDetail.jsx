import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSeasonDetail, getShowDetail, getToken, getRatingsForShow, rateEpisode } from '../api'
import EpisodeRow from '../components/EpisodeRow.jsx'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export default function SeriesDetail() {
  const { id } = useParams()
  const [show, setShow] = useState(null)
  const [season, setSeason] = useState(null)
  const [activeSeason, setActiveSeason] = useState(1)
  const [myRatings, setMyRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const isLoggedIn = Boolean(getToken())

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getShowDetail(id)
        setShow(data)
        setActiveSeason(1)
      } catch (err) {
        setError('Could not load this show.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    async function loadSeason() {
      const data = await getSeasonDetail(id, activeSeason)
      setSeason(data)
    }
    if (show) loadSeason()
  }, [id, activeSeason, show])

  useEffect(() => {
    async function loadRatings() {
      if (!isLoggedIn) return
      try {
        const ratings = await getRatingsForShow(id)
        const map = {}
        ratings.forEach((r) => { map[r.episode_id] = r.score })
        setMyRatings(map)
      } catch (err) {
        // not logged in, or nothing rated yet - fine either way
      }
    }
    loadRatings()
  }, [id, isLoggedIn])

  async function handleRate(episodeId, score) {
    try {
      await rateEpisode(Number(id), episodeId, score)
      setMyRatings((prev) => ({ ...prev, [episodeId]: score }))
    } catch (err) {
      alert('Could not save your rating. Are you logged in?')
    }
  }

  if (loading) return <p style={{ padding: 32 }}>Loading...</p>
  if (error) return <p style={{ padding: 32 }}>{error}</p>
  if (!show) return null

  return (
    <div style={{ padding: '32px 56px' }}>
      <Link to="/" style={{ color: 'var(--muted)' }}>&larr; Back</Link>

      <h1>{show.title}</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 640 }}>{show.overview}</p>

      <div style={{ display: 'flex', gap: 8, margin: '24px 0' }}>
        {Array.from({ length: show.number_of_seasons || 1 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setActiveSeason(num)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: activeSeason === num ? 'var(--accent)' : 'transparent',
              color: activeSeason === num ? '#15130F' : 'var(--text)',
              cursor: 'pointer',
            }}
          >
            Season {num}
          </button>
        ))}
      </div>

      <div>
        {season?.episodes?.map((ep) => (
          <EpisodeRow
            key={ep.id}
            episode={ep}
            userRating={myRatings[ep.id]}
            onRate={isLoggedIn ? (score) => handleRate(ep.id, score) : null}
          />
        ))}
      </div>
    </div>
  )
}