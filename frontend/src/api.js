const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function ping() {
  const res = await fetch(`${BASE_URL}/ping`)
  return res.json()
}

export async function getTrending(window = 'week') {
  const res = await fetch(`${BASE_URL}/trending?window=${window}`)
  return res.json()
}

export async function searchShows(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`)
  return res.json()
}

export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genres`)
  return res.json()
}

export async function discoverByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover?genre_id=${genreId}`)
  return res.json()
}

export async function getShowDetail(id) {
  const res = await fetch(`${BASE_URL}/tv/${id}`)
  return res.json()
}

export async function getSeasonDetail(id, seasonNumber) {
  const res = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}`)
  return res.json()
}