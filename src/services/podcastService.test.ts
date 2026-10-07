import { http, HttpResponse } from "msw";
import {
  BLOCKED_FEED_URL,
  FEED_URL,
  PODCAST_ID,
  allOriginsFeedUrl,
  lookupResponse,
} from "../test/fixtures/podcasts";
import { LOOKUP_ENDPOINT, server } from "../test/msw";
import { getPodcastDetail, getTopPodcasts } from "./podcastService";

const TOP_PODCASTS_CACHE_KEY = "podcast-app:top-podcasts";
const PODCAST_DETAIL_CACHE_KEY = `podcast-app:podcast-detail:${PODCAST_ID}`;

const CACHE_DURATION = 24 * 60 * 60 * 1000;
const FROZEN_NOW = new Date("2026-01-15T12:00:00Z");

const CACHED_PODCASTS = [
  {
    id: "cached-1",
    title: "Cached Podcast",
    author: "Cached Author",
    artworkUrl: "",
    description: "",
  },
];

const CACHED_DETAIL = {
  podcast: CACHED_PODCASTS[0],
  episodes: [],
};

function freezeClock() {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(FROZEN_NOW);
}

function seedCache(key: string, data: unknown, ageMs: number) {
  localStorage.setItem(
    key,
    JSON.stringify({ timestamp: Date.now() - ageMs, data }),
  );
}

function readCache(key: string) {
  return JSON.parse(localStorage.getItem(key) as string);
}

describe("getTopPodcasts", () => {
  it("reuses the cached podcasts while the cache is still valid", async () => {
    freezeClock();
    seedCache(TOP_PODCASTS_CACHE_KEY, CACHED_PODCASTS, CACHE_DURATION - 1);

    await expect(getTopPodcasts()).resolves.toEqual(CACHED_PODCASTS);
  });

  it("requests the podcasts again and refreshes the cache once it expires", async () => {
    freezeClock();
    seedCache(TOP_PODCASTS_CACHE_KEY, CACHED_PODCASTS, CACHE_DURATION);

    const podcasts = await getTopPodcasts();

    expect(podcasts).toHaveLength(100);

    const cache = readCache(TOP_PODCASTS_CACHE_KEY);

    expect(cache.timestamp).toBe(FROZEN_NOW.getTime());
    expect(cache.data).toHaveLength(100);
  });
});

describe("getPodcastDetail", () => {
  it("reuses the cached podcast detail while the cache is still valid", async () => {
    freezeClock();
    seedCache(PODCAST_DETAIL_CACHE_KEY, CACHED_DETAIL, CACHE_DURATION - 1);

    await expect(getPodcastDetail(PODCAST_ID)).resolves.toEqual(CACHED_DETAIL);
  });

  it("requests the podcast detail again and refreshes the cache once it expires", async () => {
    freezeClock();
    seedCache(PODCAST_DETAIL_CACHE_KEY, CACHED_DETAIL, CACHE_DURATION);

    const detail = await getPodcastDetail(PODCAST_ID);

    expect(detail.podcast.title).toBe("Test Podcast");

    const cache = readCache(PODCAST_DETAIL_CACHE_KEY);

    expect(cache.timestamp).toBe(FROZEN_NOW.getTime());
    expect(cache.data.podcast.title).toBe("Test Podcast");
  });

  it("loads the podcast description from the feed without a proxy when the direct request works", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const detail = await getPodcastDetail(PODCAST_ID);

    expect(detail.podcast.description).toBe("Default feed description");
    expect(fetchSpy).toHaveBeenCalledWith(FEED_URL);
    expect(fetchSpy).not.toHaveBeenCalledWith(allOriginsFeedUrl());
  });

  it("falls back to the AllOrigins proxy when the direct feed request fails", async () => {
    server.use(
      http.get(LOOKUP_ENDPOINT, () =>
        HttpResponse.json(
          lookupResponse({ podcast: { feedUrl: BLOCKED_FEED_URL } }),
        ),
      ),
      http.get(BLOCKED_FEED_URL, () => HttpResponse.error()),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const detail = await getPodcastDetail(PODCAST_ID);

    expect(detail.podcast.description).toBe("Default feed description");
    expect(fetchSpy).toHaveBeenCalledWith(BLOCKED_FEED_URL);
    expect(fetchSpy).toHaveBeenCalledWith(allOriginsFeedUrl(BLOCKED_FEED_URL));
  });
});
