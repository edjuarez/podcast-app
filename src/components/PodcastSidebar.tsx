import { Link } from 'react-router-dom'
import type { Podcast } from '../types/podcast'

interface PodcastSidebarProps {
  podcast: Podcast
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  return (
    <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Link to={`/podcast/${podcast.id}`}>
        <img
          src={podcast.artworkUrl}
          alt=""
          className="aspect-square w-full rounded-lg object-cover"
        />

        <h1 className="mt-6 text-xl font-bold">
            {podcast.title}
        </h1>

        <p className="mt-2 text-sm text-gray-600">
            by {podcast.author}
        </p>
      </Link>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="font-medium text-gray-900 mb-3">Description:</p>
        <p className="text-sm leading-6 text-gray-600">
          {podcast.description}
        </p>
      </div>
    </aside>
  )
}