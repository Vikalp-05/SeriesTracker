import { Link } from 'react-router-dom'
import RatingBadge from './RatingBadge.jsx'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342'

export default function ShowCard({ show }) {
  const posterUrl = show?.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : null

  return (
    <Link
      to={`/series/${show?.id}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'inherit' }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '2 / 3',
          borderRadius: '10px',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={show?.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,236,0.25)',
            }}
          >
            No Image
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '999px',
            padding: '5px 9px',
          }}
        >
          <RatingBadge rating={show?.vote_average?.toFixed(1)} />
        </div>
      </div>

      <div>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>{show?.name ?? 'Untitled'}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
          {show?.first_air_date?.slice(0, 4) ?? '—'}
        </div>
      </div>
    </Link>
  )
}