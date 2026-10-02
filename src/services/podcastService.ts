import type { Podcast } from '../types/podcast'

const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

interface ItunesPodcast {
  id: {
    attributes: {
      'im:id': string
    }
  }

  'im:name': {
    label: string
  }

  'im:artist': {
    label: string
  }

  'im:image': Array<{
    label: string
  }>

  summary?: {
    label: string
  }
}

interface ItunesResponse {
  feed: {
    entry: ItunesPodcast[]
  }
}

export async function getTopPodcasts(): Promise<Podcast[]> {
  const response = await fetch(TOP_PODCASTS_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch podcasts: ${response.status}`)
  }

  const data: ItunesResponse = await response.json()

  return data.feed.entry.map((podcast) => ({
    id: podcast.id.attributes['im:id'],
    title: podcast['im:name'].label,
    author: podcast['im:artist'].label,
    artworkUrl: podcast['im:image'][2]?.label ?? '',
    description: podcast.summary?.label ?? '',
  }))
}