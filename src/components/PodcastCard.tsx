import { Link } from 'react-router-dom'
import type { Podcast } from '../types/podcast'

interface PodcastCardProps {
  podcast: Podcast
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link
      to={`/podcast/${podcast.id}`}
      className="group block pt-16"
    >
      <article className="relative rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="absolute left-1/2 top-0 z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-md">
          <img
            src={podcast.artworkUrl}
            alt={podcast.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-h-40 flex-col items-center justify-center px-4 pb-6 pt-20">
          <h2 className="line-clamp-2 text-center text-lg font-semibold uppercase">
            {podcast.title}
          </h2>

          <p className="mt-2 text-center text-sm text-gray-500">
            {podcast.author}
          </p>
        </div>
      </article>
    </Link>
  )
}