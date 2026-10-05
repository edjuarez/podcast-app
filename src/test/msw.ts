import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  ALL_ORIGINS_RAW_ENDPOINT,
  FEED_URL,
  LOOKUP_ENDPOINT,
  PODCAST_ID,
  TOP_PODCASTS_ENDPOINT,
  feedXml,
  lookupResponse,
  topPodcastsResponse,
} from './fixtures/podcasts'

export { ALL_ORIGINS_RAW_ENDPOINT, FEED_URL, LOOKUP_ENDPOINT, TOP_PODCASTS_ENDPOINT }

const feedResponse = () =>
  HttpResponse.text(feedXml(), {
    headers: { 'Content-Type': 'application/xml' },
  })

export const handlers = [
  http.get(TOP_PODCASTS_ENDPOINT, () =>
    HttpResponse.json(topPodcastsResponse()),
  ),
  http.get(LOOKUP_ENDPOINT, ({ request }) => {
    const podcastId = new URL(request.url).searchParams.get('id') ?? PODCAST_ID

    return HttpResponse.json(lookupResponse({ podcast: { collectionId: Number(podcastId) } }))
  }),
  http.get(FEED_URL, feedResponse),
  http.get(ALL_ORIGINS_RAW_ENDPOINT, feedResponse),
]

export const server = setupServer(...handlers)