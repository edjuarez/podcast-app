import { Link } from 'react-router-dom'
import type { Episode } from '../types/episode'

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
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1fr_120px_100px] border-b border-gray-200 px-4 py-3 text-sm font-semibold ">
        <span>Title</span>
        <span>Date</span>
        <span>Duration</span>
      </div>

      {episodes.map((episode) => (
        <article
          key={episode.id}
          className="grid grid-cols-[1fr_120px_100px] items-center border-b border-gray-200 px-4 py-4 last:border-b-0"
        >
          <Link
            to={`/podcast/${podcastId}/episode/${episode.id}`}
            className="font-semibold hover:underline text-[#2e79ad] w-[600px]"
          >
            {episode.title}
          </Link>

          <span className="text-sm text-black-600">
            {formatDate(episode.date)}
          </span>

          <span className="text-sm text-black-600">
            {formatDuration(episode.duration)}
          </span>
        </article>
      ))}
    </div>
  )
}