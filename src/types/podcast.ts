import type { Episode } from './episode'

export interface Podcast {
  id: string
  title: string
  author: string
  artworkUrl: string
  description: string
}

export interface PodcastDetail {
  podcast: Podcast
  episodes: Episode[]
}