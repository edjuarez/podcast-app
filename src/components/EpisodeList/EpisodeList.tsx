import { Link } from 'react-router-dom'
import type { Episode } from '../../types/episode'

interface EpisodeListProps {
  podcastId: string
  episodes: Episode[]
}

function formatDuration(duration: number) {
  const totalMinutes = Math.floor(duration / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }

  return `${minutes}min`
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB')
}

export function EpisodeList({
  podcastId,
  episodes,
}: EpisodeListProps) {
  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
      {episodes.map((episode) => (
        <article
          key={episode.id}
          className="p-4"
        >
          <Link
            to={`/podcast/${podcastId}/episode/${episode.id}`}
            className="font-semibold hover:underline"
          >
            {episode.title}
          </Link>

          <div className="mt-2 flex gap-4 text-sm text-gray-500">
            <span>{formatDate(episode.date)}</span>
            <span>{formatDuration(episode.duration)}</span>
          </div>
        </article>
      ))}
    </div>
  )
}