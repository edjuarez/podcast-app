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
      <table className="w-full table-fixed border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-200 text-sm font-semibold">
            <th scope="col" className="px-4 py-3">
              Title
            </th>

            <th scope="col" className="w-[120px] px-4 py-3">
              Date
            </th>

            <th scope="col" className="w-[100px] px-4 py-3">
              Duration
            </th>
          </tr>
        </thead>

        <tbody>
          {episodes.map((episode) => (
            <tr
              key={episode.id}
              className="border-b border-gray-200 last:border-b-0"
            >
              <th
                scope="row"
                className="px-4 py-4 text-left font-normal"
              >
                <Link
                  to={`/podcast/${podcastId}/episode/${episode.id}`}
                  className="font-semibold hover:underline text-[#2e79ad]"
                >
                  {episode.title}
                </Link>
              </th>

              <td className="px-4 py-4 align-middle text-sm text-gray-600">
                {formatDate(episode.date)}
              </td>

              <td className="px-4 py-4 align-middle text-sm text-gray-600">
                {formatDuration(episode.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}