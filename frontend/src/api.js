const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export async function ping() {
  const res = await fetch(`${BASE_URL}/ping`)
  return res.json()
}