import { useParams } from 'react-router-dom'

export default function SeriesDetail() {
  const { id } = useParams()

  return (
    <div style={{ padding: '32px 56px' }}>
      <h1>Series Detail</h1>
      <p style={{ color: 'var(--muted)' }}>
        {id}
      </p>
    </div>
  )
}