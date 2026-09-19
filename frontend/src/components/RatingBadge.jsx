export default function RatingBadge({ rating }) {
  return (
    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
      {rating ?? '–'}
    </span>
  )
}