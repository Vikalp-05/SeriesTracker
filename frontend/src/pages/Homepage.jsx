import { useEffect, useState } from 'react'
import { discoverByGenre, getGenres, getTrending, searchShows } from '../api.js'
import ShowCard from '../components/ShowCard.jsx'

export default function Homepage() {
  const [shows, setShows] = useState([])
  const [genres, setGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [trendingWindow, setTrendingWindow] = useState('week')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => {}) 
  }, [])

  // Decide what to fetch whenever search, genre
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      setError(null)

      let request
      if (searchQuery.trim()) {
        request = searchShows(searchQuery.trim())
      } else if (selectedGenre) {
        request = discoverByGenre(selectedGenre)
      } else {
        request = getTrending(trendingWindow)
      }

      request
        .then(setShows)
        .catch(() => setError('Could not load shows. Is the backend running?'))
        .finally(() => setLoading(false))
    }, 400) 

    return () => clearTimeout(timer)
  }, [searchQuery, selectedGenre, trendingWindow])

  return (
    <div style={{ padding: '32px 56px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '22px' }}>Trending TV Shows</h1>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="search"
            placeholder="Search TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text)',
              width: '240px',
            }}
          />

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--muted)',
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {!searchQuery && !selectedGenre && (
            <div
              style={{
                display: 'flex',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '4px',
              }}
            >
              <button
                onClick={() => setTrendingWindow('day')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: trendingWindow === 'day' ? 'var(--accent)' : 'transparent',
                  color: trendingWindow === 'day' ? '#1A140A' : 'var(--muted)',
                }}
              >
                Today
              </button>
              <button
                onClick={() => setTrendingWindow('week')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                  background: trendingWindow === 'week' ? 'var(--accent)' : 'transparent',
                  color: trendingWindow === 'week' ? '#1A140A' : 'var(--muted)',
                }}
              >
                This Week
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <p style={{ color: 'var(--muted)' }}>Loading...</p>}
      {error && <p style={{ color: 'var(--accent)' }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '26px',
          }}
        >
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}

      {!loading && !error && shows.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>No shows found.</p>
      )}
    </div>
  )
}