export const PODCAST_ID = '1234567890'
export const EPISODE_ID = '987654321'
export const FEED_URL = 'https://feeds.test/podcast.xml'

export const TOP_PODCASTS_ENDPOINT =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'
export const LOOKUP_ENDPOINT = 'https://itunes.apple.com/lookup'

interface TopPodcastOverrides {
  id?: string
  title?: string
  author?: string
}

export function topPodcastEntry(overrides: TopPodcastOverrides = {}) {
  const {
    id = PODCAST_ID,
    title = 'Test Podcast',
    author = 'Test Author',
  } = overrides

  return {
    id: { attributes: { 'im:id': id } },
    'im:name': { label: title },
    'im:artist': { label: author },
    'im:image': [0, 1, 2].map((index) => ({
      label: `https://art.test/${index}.jpg`,
    })),
    summary: { label: 'A <b>bold</b> summary' },
  }
}

export function topPodcastsResponse(count = 100) {
  return {
    feed: {
      entry: Array.from({ length: count }, (_, index) =>
        topPodcastEntry({
          id: String(1000 + index),
          title: `Podcast ${index + 1}`,
          author: `Author ${(index % 5) + 1}`,
        }),
      ),
    },
  }
}

interface PodcastResultOverrides {
  collectionId?: number
}

export function lookupPodcastResult(overrides: PodcastResultOverrides = {}) {
  return {
    wrapperType: 'track',
    kind: 'podcast',
    collectionId: Number(PODCAST_ID),
    collectionName: 'Test Podcast',
    artistName: 'Test Author',
    artworkUrl600: 'https://art.test/600.jpg',
    feedUrl: FEED_URL,
    ...overrides,
  }
}

export function lookupEpisodeResult(index = 1) {
  return {
    wrapperType: 'podcastEpisode',
    kind: 'podcast-episode',
    trackId: Number(EPISODE_ID) + index,
    trackName: `Episode ${index}`,
    description: '<p>Episode <b>description</b></p>',
    releaseDate: '2026-01-01T00:00:00Z',
    trackTimeMillis: 2_700_000,
    episodeUrl: `https://audio.test/${index}.mp3`,
    collectionId: Number(PODCAST_ID),
  }
}

interface LookupOverrides {
  podcast?: PodcastResultOverrides
  episodeCount?: number
}

export function lookupResponse(overrides: LookupOverrides = {}) {
  const { podcast = {}, episodeCount = 3 } = overrides

  return {
    resultCount: episodeCount + 1,
    results: [
      lookupPodcastResult(podcast),
      ...Array.from({ length: episodeCount }, (_, index) =>
        lookupEpisodeResult(index + 1),
      ),
    ],
  }
}

interface FeedXmlOptions {
  description?: string
  summary?: string
}

export function feedXml(options: FeedXmlOptions = {}) {
  const { description, summary } = options

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Test Podcast</title>
    ${summary === undefined ? '' : `<itunes:summary>${summary}</itunes:summary>`}
    ${description === undefined ? '' : `<description>${description}</description>`}
  </channel>
</rss>`
}