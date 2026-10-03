import { Link } from 'react-router-dom'
import type { Podcast } from '../../types/podcast'

interface PodcastCardProps {
  podcast: Podcast
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link
      to={`/podcast/${podcast.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <img
          src={podcast.artworkUrl}
          alt={podcast.title}
          className="w-full object-cover"
        />

        <div className="p-4 flex flex-col items-center justify-center">
          <h2 className="line-clamp-2 text-lg font-semibold">
            {podcast.title}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {podcast.author}
          </p>
        </div>
      </article>
    </Link>
  )
}
