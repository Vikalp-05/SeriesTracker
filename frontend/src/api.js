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

export async function signup(email, password) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Signup failed')
  }
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail || 'Login failed')
  }
  const data = await res.json()
  localStorage.setItem('token', data.access_token)
  return data
}

export function logout() {
  localStorage.removeItem('token')
}

export function getToken() {
  return localStorage.getItem('token')
}