import { Link } from 'react-router-dom'
import type { Podcast } from '../../types/podcast'

interface PodcastCardProps {
  podcast: Podcast
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link to={`/podcast/${podcast.id}`}>
      <article>
        <img
          src={podcast.artworkUrl}
          alt={podcast.title}
        />

        <h2>{podcast.title}</h2>
        <p>{podcast.author}</p>
      </article>
    </Link>
  )
}
