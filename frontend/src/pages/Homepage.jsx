import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { discoverByGenre, getGenres, getTrending, searchShows, getToken, logout } from '../api'
import ShowCard from '../components/ShowCard.jsx'

const inputStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '8px 12px',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
}

const buttonStyle = (active) => ({
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: active ? 'var(--accent)' : 'var(--surface)',
  color: active ? '#15130F' : 'var(--text)',
  cursor: 'pointer',
  fontSize: 14,
})

const linkButtonStyle = {
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  textDecoration: 'none',
  fontSize: 14,
  cursor: 'pointer',
}

export default function Homepage() {
  const [shows, setShows] = useState([])
  const [query, setQuery] = useState('')
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [timeWindow, setTimeWindow] = useState('day')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  const isLoggedIn = Boolean(getToken())

  useEffect(() => {
    getGenres().then(setGenres).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(loadShows, 400)
    return () => clearTimeout(timer)
  }, [query, selectedGenre, timeWindow])

  async function loadShows() {
    try {
      setLoading(true)
      setError(null)
      let data
      if (query.trim()) {
        data = await searchShows(query)
      } else if (selectedGenre) {
        data = await discoverByGenre(selectedGenre)
      } else {
        data = await getTrending(timeWindow)
      }
      setShows(data)
    } catch (err) {
      setError('Could not load shows. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '32px 56px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Trending TV Shows</h1>
        {isLoggedIn ? (
          <button style={linkButtonStyle} onClick={() => { logout(); window.location.reload() }}>Log Out</button>
        ) : (
          <Link to="/login" style={linkButtonStyle}>Log In</Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
          placeholder="Search shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
/>
        <select style={inputStyle} value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        {!query && !selectedGenre && (
          <div>
            <button style={buttonStyle(timeWindow === 'day')} onClick={() => setTimeWindow('day')} disabled={timeWindow === 'day'}>Today</button>
            <button style={buttonStyle(timeWindow === 'week')} onClick={() => setTimeWindow('week')} disabled={timeWindow === 'week'}>This Week</button>
          </div>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>
    </div>
  )
}