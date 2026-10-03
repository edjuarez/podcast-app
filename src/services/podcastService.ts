import type { Podcast } from '../types/podcast'

const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

const CACHE_KEY = 'podcast-app:top-podcasts'
const CACHE_DURATION = 24 * 60 * 60 * 1000

interface PodcastCache {
  timestamp: number
  data: Podcast[]
}

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
  const cached = localStorage.getItem(CACHE_KEY)

  if (cached) {
    const parsed: PodcastCache = JSON.parse(cached)

    const isCacheValid =
      Date.now() - parsed.timestamp < CACHE_DURATION

    if (isCacheValid) {
      return parsed.data
    }
  }

  const response = await fetch(TOP_PODCASTS_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch podcasts: ${response.status}`)
  }

  const data: ItunesResponse = await response.json()

  const podcasts = data.feed.entry.map((podcast) => ({
    id: podcast.id.attributes['im:id'],
    title: podcast['im:name'].label,
    author: podcast['im:artist'].label,
    artworkUrl: podcast['im:image'][2]?.label ?? '',
    description: podcast.summary?.label ?? '',
  }))

  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data: podcasts,
    }),
  )

  return podcasts
}