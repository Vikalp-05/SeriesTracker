import RatingBadge from './RatingBadge.jsx'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300'

export default function EpisodeRow({ episode, userRating, onRate }) {
  const thumbnailUrl = episode?.still_path ? `${IMAGE_BASE_URL}${episode.still_path}` : null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--muted)', width: '32px' }}>
        {String(episode?.episode_number ?? '').padStart(2, '0')}
      </div>

      <div
        style={{
          width: '130px',
          aspectRatio: '16 / 9',
          borderRadius: '8px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={episode?.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>{episode?.name ?? 'Untitled Episode'}</div>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
          {episode?.air_date ? `Aired ${episode.air_date}` : 'Air date unknown'}
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: '999px', border: '1px solid var(--border)', padding: '6px 12px' }}>
        <RatingBadge rating={episode?.vote_average?.toFixed(1)} />
      </div>

      {onRate && (
        <select
          value={userRating ?? ''}
          onChange={(e) => onRate(Number(e.target.value))}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 10px',
            color: 'var(--text)',
            fontSize: '13px',
          }}
        >
          <option value="" disabled>Rate</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      )}
    </div>
  )
}