export default function ShowCard({ show }) {
  return (
    <div>
      <p>{show?.title ?? 'Show Card'}</p>
    </div>
  )
}