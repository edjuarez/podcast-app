import { http, HttpResponse } from 'msw'
import {
  FEED_URL,
  LOOKUP_ENDPOINT,
  TOP_PODCASTS_ENDPOINT,
  server,
} from '../test/msw'
import { PODCAST_ID, feedXml } from '../test/fixtures/podcasts'
import { getPodcastDetail, getTopPodcasts } from './podcastService'

const TOP_PODCASTS_CACHE_KEY = 'podcast-app:top-podcasts'
const PODCAST_DETAIL_CACHE_KEY = `podcast-app:podcast-detail:${PODCAST_ID}`

const CACHE_DURATION = 24 * 60 * 60 * 1000
const FROZEN_NOW = new Date('2026-01-15T12:00:00Z')

const SENTINEL_PODCASTS = [
  {
    id: 'cached-1',
    title: 'Cached Podcast',
    author: 'Cached Author',
    artworkUrl: '',
    description: '',
  },
]

function freezeClock() {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(FROZEN_NOW)
}

function seedCache(key: string, data: unknown, ageMs: number) {
  localStorage.setItem(
    key,
    JSON.stringify({ timestamp: Date.now() - ageMs, data }),
  )
}

describe('getTopPodcasts', () => {
  it('maps the RSS response to Podcast objects', async () => {
    const podcasts = await getTopPodcasts()

    expect(podcasts).toHaveLength(100)
    expect(podcasts[0]).toEqual({
      id: '1000',
      title: 'Podcast 1',
      author: 'Author 1',
      artworkUrl: 'https://art.test/2.jpg',
      description: 'A <b>bold</b> summary',
    })
  })

  it('returns the cached podcasts without hitting the network when cache is fresh', async () => {
    freezeClock()
    seedCache(TOP_PODCASTS_CACHE_KEY, SENTINEL_PODCASTS, CACHE_DURATION - 1)

    const podcasts = await getTopPodcasts()

    expect(podcasts).toEqual(SENTINEL_PODCASTS)
  })

  it('refetches and refreshes the cache once the 24h window has elapsed', async () => {
    freezeClock()
    seedCache(TOP_PODCASTS_CACHE_KEY, SENTINEL_PODCASTS, CACHE_DURATION)

    const podcasts = await getTopPodcasts()

    expect(podcasts).toHaveLength(100)

    const cached = JSON.parse(
      localStorage.getItem(TOP_PODCASTS_CACHE_KEY) as string,
    )

    expect(cached.timestamp).toBe(FROZEN_NOW.getTime())
    expect(cached.data).toHaveLength(100)
  })

  it('throws with the status code when the request fails', async () => {
    server.use(
      http.get(TOP_PODCASTS_ENDPOINT, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    )

    await expect(getTopPodcasts()).rejects.toThrow(
      'Failed to fetch podcasts: 500',
    )
  })
})

describe('getPodcastDetail', () => {
  it('maps the podcast and excludes the podcast entry from the episodes', async () => {
    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail.podcast).toEqual({
      id: PODCAST_ID,
      title: 'Test Podcast',
      author: 'Test Author',
      artworkUrl: 'https://art.test/600.jpg',
      description: 'Default feed description',
    })
    expect(detail.episodes).toHaveLength(3)
  })

  it('maps episode fields from the lookup payload', async () => {
    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail.episodes[0]).toEqual({
      id: '987654322',
      title: 'Episode 1',
      description: '<p>Episode <b>description</b></p>',
      date: '2026-01-01T00:00:00Z',
      duration: 2_700_000,
      audioUrl: 'https://audio.test/1.mp3',
    })
  })

  it('returns the cached detail without hitting the network when cache is fresh', async () => {
    freezeClock()
    const sentinel = { podcast: SENTINEL_PODCASTS[0], episodes: [] }
    seedCache(PODCAST_DETAIL_CACHE_KEY, sentinel, CACHE_DURATION - 1)

    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail).toEqual(sentinel)
  })

  it('refetches and refreshes the cache once the 24h window has elapsed', async () => {
    freezeClock()
    seedCache(
      PODCAST_DETAIL_CACHE_KEY,
      { podcast: null, episodes: [] },
      CACHE_DURATION,
    )

    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail.podcast.title).toBe('Test Podcast')

    const cached = JSON.parse(
      localStorage.getItem(PODCAST_DETAIL_CACHE_KEY) as string,
    )

    expect(cached.timestamp).toBe(FROZEN_NOW.getTime())
    expect(cached.data.podcast.title).toBe('Test Podcast')
  })

  it('throws when the podcast is not present in the lookup results', async () => {
    server.use(
      http.get(LOOKUP_ENDPOINT, () =>
        HttpResponse.json({ resultCount: 0, results: [] }),
      ),
    )

    await expect(getPodcastDetail(PODCAST_ID)).rejects.toThrow(
      'Podcast not found',
    )
  })
})

describe('getPodcastDetail feed description', () => {
  it('prefers the summary over the description', async () => {
    server.use(
      http.get(FEED_URL, () =>
        HttpResponse.text(
          feedXml({
            summary: 'From summary',
            description: 'From description',
          }),
        ),
      ),
    )

    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail.podcast.description).toBe('From summary')
  })

  it('strips the html of the feed text', async () => {
    server.use(
      http.get(FEED_URL, () =>
        HttpResponse.text(feedXml({ description: '<p>Hello <b>world</b></p>' })),
      ),
    )

    const detail = await getPodcastDetail(PODCAST_ID)

    expect(detail.podcast.description).toBe('Hello world')
  })
})