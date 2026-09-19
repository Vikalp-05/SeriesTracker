export default function EpisodeRow({ episode }) {
  return (
    <div>
      <p>{episode?.title ?? 'Episode Row'}</p>
    </div>
  )
}