import type { Episode } from '../types/episode'
import type { Podcast, PodcastDetail } from '../types/podcast'

const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

const PODCAST_DETAIL_URL =
  'https://itunes.apple.com/lookup'

const TOP_PODCASTS_CACHE_KEY = 'podcast-app:top-podcasts'
const CACHE_DURATION = 24 * 60 * 60 * 1000

interface PodcastCache {
  timestamp: number
  data: Podcast[]
}

interface PodcastDetailCache {
  timestamp: number
  data: PodcastDetail
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

interface ItunesTopPodcastsResponse {
  feed: {
    entry: ItunesPodcast[]
  }
}

interface ItunesPodcastResult {
  wrapperType: string
  kind?: string
  collectionId?: number
  trackId?: number
  collectionName?: string
  trackName?: string
  artistName?: string
  artworkUrl600?: string
  artworkUrl100?: string
  collectionCensoredName?: string
  description?: string
  releaseDate?: string
  trackTimeMillis?: number
  episodeUrl?: string
  feedUrl?: string
}

interface ItunesPodcastDetailResponse {
  resultCount: number
  results: ItunesPodcastResult[]
}

export async function getTopPodcasts(): Promise<Podcast[]> {
  const cached = localStorage.getItem(TOP_PODCASTS_CACHE_KEY)

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

  const data: ItunesTopPodcastsResponse = await response.json()

  const podcasts = data.feed.entry.map((podcast) => ({
    id: podcast.id.attributes['im:id'],
    title: podcast['im:name'].label,
    author: podcast['im:artist'].label,
    artworkUrl: podcast['im:image'][2]?.label ?? '',
    description: podcast.summary?.label ?? '',
  }))

  localStorage.setItem(
    TOP_PODCASTS_CACHE_KEY,
    JSON.stringify({
      timestamp: Date.now(),
      data: podcasts,
    }),
  )

  return podcasts
}

function readChannelText(channel: Element, localName: string): string {
  for (const child of Array.from(channel.children)) {
    if (child.localName === localName) {
      return child.textContent?.trim() ?? ''
    }
  }

  return ''
}

function stripHtml(html: string): string {
  const { body } = new DOMParser().parseFromString(html, 'text/html')

  return body.textContent?.trim() ?? ''
}

async function getFeedDescription(feedUrl: string): Promise<string> {
  if (!feedUrl) {
    return ''
  }

  try {
    const response = await fetch(feedUrl)

    if (!response.ok) {
      return ''
    }

    const xml = new DOMParser().parseFromString(
      await response.text(),
      'application/xml',
    )

    if (xml.querySelector('parsererror')) {
      return ''
    }

    const channel = xml.querySelector('channel')

    if (!channel) {
      return ''
    }

    const text =
      readChannelText(channel, 'summary') ||
      readChannelText(channel, 'description')

    return text ? stripHtml(text) : ''
  } catch (error) {
    console.warn('Could not load podcast description from feed', error)

    return ''
  }
}

export async function getPodcastDetail(
  podcastId: string,
): Promise<PodcastDetail> {
  const cacheKey = `podcast-app:podcast-detail:${podcastId}`
  const cached = localStorage.getItem(cacheKey)

  if (cached) {
    const parsed: PodcastDetailCache = JSON.parse(cached)

    const isCacheValid =
      Date.now() - parsed.timestamp < CACHE_DURATION

    if (isCacheValid) {
      return parsed.data
    }
  }

  const url = `${PODCAST_DETAIL_URL}?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=200`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch podcast detail: ${response.status}`,
    )
  }

  const data: ItunesPodcastDetailResponse = await response.json()

  const podcastResult = data.results.find(
    (result) => String(result.collectionId) === podcastId,
  )

  if (!podcastResult) {
    throw new Error('Podcast not found')
  }

  const podcast: Podcast = {
    id: String(podcastResult.collectionId ?? podcastId),
    title: podcastResult.collectionName ?? '',
    author: podcastResult.artistName ?? '',
    artworkUrl:
      podcastResult.artworkUrl600 ??
      podcastResult.artworkUrl100 ??
      '',
    description: await getFeedDescription(podcastResult.feedUrl ?? ''),
  }

  const episodes: Episode[] = data.results
    .filter((result) => result.kind === 'podcast-episode')
    .map((episode) => ({
      id: String(episode.trackId ?? ''),
      title: episode.trackName ?? '',
      description: episode.description ?? '',
      date: episode.releaseDate ?? '',
      duration: episode.trackTimeMillis ?? 0,
      audioUrl: episode.episodeUrl ?? '',
    }))

  const podcastDetail: PodcastDetail = {
    podcast,
    episodes,
  }

  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        data: podcastDetail,
      }),
    )
  } catch (error) {
    console.warn('Could not cache podcast detail', error)
  }

  return podcastDetail
}