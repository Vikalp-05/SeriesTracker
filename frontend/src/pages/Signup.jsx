import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, signup } from '../api.js'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await signup(email, password)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '56px', maxWidth: '360px' }}>
      <h1 style={{ fontSize: '22px' }}>Sign Up</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
        />
        {error && <p style={{ color: 'var(--accent)', fontSize: '13px' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px', borderRadius: '8px', border: 'none', background: 'var(--accent)', color: '#1A140A', fontWeight: 600, cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '16px' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
      </p>
    </div>
  )
}