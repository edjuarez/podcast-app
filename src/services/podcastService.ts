import type { Episode } from "../types/episode";
import type { Podcast, PodcastDetail } from "../types/podcast";

const TOP_PODCASTS_URL =
  "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json";

const PODCAST_DETAIL_URL = "https://itunes.apple.com/lookup";

const ALL_ORIGINS_RAW_ENDPOINT = "https://api.allorigins.win/raw";

const CACHE_STORE_KEY = "podcast-app:store";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

interface AppCacheStore {
  topPodcasts?: CacheEntry<Podcast[]>;
  podcastDetails: Record<string, CacheEntry<PodcastDetail>>;
}

function getCacheStore(): AppCacheStore {
  try {
    const raw = localStorage.getItem(CACHE_STORE_KEY);

    if (!raw) {
      return { podcastDetails: {} };
    }

    const parsed: AppCacheStore = JSON.parse(raw);

    return {
      topPodcasts: parsed.topPodcasts,
      podcastDetails: parsed.podcastDetails ?? {},
    };
  } catch (error) {
    console.warn("Failed to read cache store from localStorage:", error);

    return { podcastDetails: {} };
  }
}

function saveCacheStore(store: AppCacheStore): void {
  try {
    const now = Date.now();

    const cleanDetails: Record<string, CacheEntry<PodcastDetail>> = {};

    for (const [id, entry] of Object.entries(store.podcastDetails)) {
      if (now - entry.timestamp < CACHE_DURATION) {
        cleanDetails[id] = entry;
      }
    }

    const isTopPodcastsValid =
      store.topPodcasts &&
      now - store.topPodcasts.timestamp < CACHE_DURATION;

    const updatedStore: AppCacheStore = {
      topPodcasts: isTopPodcastsValid ? store.topPodcasts : undefined,
      podcastDetails: cleanDetails,
    };

    localStorage.setItem(CACHE_STORE_KEY, JSON.stringify(updatedStore));
  } catch (error) {
    console.warn("Could not persist cache store to localStorage:", error);
  }
}

interface ItunesPodcast {
  id: {
    attributes: {
      "im:id": string;
    };
  };

  "im:name": {
    label: string;
  };

  "im:artist": {
    label: string;
  };

  "im:image": Array<{
    label: string;
  }>;

  summary?: {
    label: string;
  };
}

interface ItunesTopPodcastsResponse {
  feed: {
    entry: ItunesPodcast[];
  };
}

interface ItunesPodcastResult {
  wrapperType: string;
  kind?: string;
  collectionId?: number;
  trackId?: number;
  collectionName?: string;
  trackName?: string;
  artistName?: string;
  artworkUrl600?: string;
  artworkUrl100?: string;
  collectionCensoredName?: string;
  description?: string;
  releaseDate?: string;
  trackTimeMillis?: number;
  episodeUrl?: string;
  feedUrl?: string;
}

interface ItunesPodcastDetailResponse {
  resultCount: number;
  results: ItunesPodcastResult[];
}

export async function getTopPodcasts(): Promise<Podcast[]> {
  const store = getCacheStore();
  const now = Date.now();

  if (
    store.topPodcasts &&
    now - store.topPodcasts.timestamp < CACHE_DURATION
  ) {
    return store.topPodcasts.data;
  }

  const response = await fetch(TOP_PODCASTS_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch podcasts: ${response.status}`);
  }

  const data: ItunesTopPodcastsResponse = await response.json();

  const podcasts = data.feed.entry.map((podcast) => ({
    id: podcast.id.attributes["im:id"],
    title: podcast["im:name"].label,
    author: podcast["im:artist"].label,
    artworkUrl: podcast["im:image"][2]?.label ?? "",
    description: podcast.summary?.label ?? "",
  }));

  saveCacheStore({
    ...store,
    topPodcasts: {
      timestamp: now,
      data: podcasts,
    },
  });

  return podcasts;
}

function readChannelText(channel: Element, localName: string): string {
  for (const child of Array.from(channel.children)) {
    if (child.localName === localName) {
      return child.textContent?.trim() ?? "";
    }
  }

  return "";
}

function stripHtml(html: string): string {
  const { body } = new DOMParser().parseFromString(html, "text/html");

  return body.textContent?.trim() ?? "";
}

function getAllOriginsFeedUrl(feedUrl: string): string {
  return `${ALL_ORIGINS_RAW_ENDPOINT}?url=${encodeURIComponent(feedUrl)}`;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

async function fetchFeed(feedUrl: string): Promise<string> {
  try {
    return await fetchText(feedUrl);
  } catch {
    return fetchText(getAllOriginsFeedUrl(feedUrl));
  }
}

async function getFeedDescription(feedUrl: string): Promise<string> {
  if (!feedUrl) {
    return "";
  }

  try {
    const xml = new DOMParser().parseFromString(
      await fetchFeed(feedUrl),
      "application/xml",
    );

    if (xml.querySelector("parsererror")) {
      return "";
    }

    const channel = xml.querySelector("channel");

    if (!channel) {
      return "";
    }

    const text =
      readChannelText(channel, "summary") ||
      readChannelText(channel, "description");

    return text ? stripHtml(text) : "";
  } catch (error) {
    console.warn("Could not load podcast description from feed", error);

    return "";
  }
}

export async function getPodcastDetail(
  podcastId: string,
): Promise<PodcastDetail> {
  const store = getCacheStore();
  const now = Date.now();
  const cachedDetail = store.podcastDetails[podcastId];

  if (cachedDetail && now - cachedDetail.timestamp < CACHE_DURATION) {
    return cachedDetail.data;
  }

  const url = `${PODCAST_DETAIL_URL}?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch podcast detail: ${response.status}`);
  }

  const data: ItunesPodcastDetailResponse = await response.json();

  const podcastResult = data.results.find(
    (result) => String(result.collectionId) === podcastId,
  );

  if (!podcastResult) {
    throw new Error("Podcast not found");
  }

  const podcast: Podcast = {
    id: String(podcastResult.collectionId ?? podcastId),
    title: podcastResult.collectionName ?? "",
    author: podcastResult.artistName ?? "",
    artworkUrl:
      podcastResult.artworkUrl600 ?? podcastResult.artworkUrl100 ?? "",
    description: await getFeedDescription(podcastResult.feedUrl ?? ""),
  };

  const episodes: Episode[] = data.results
    .filter((result) => result.kind === "podcast-episode")
    .map((episode) => ({
      id: String(episode.trackId ?? ""),
      title: episode.trackName ?? "",
      description: episode.description ?? "",
      date: episode.releaseDate ?? "",
      duration: episode.trackTimeMillis ?? 0,
      audioUrl: episode.episodeUrl ?? "",
    }));

  const podcastDetail: PodcastDetail = {
    podcast,
    episodes,
  };

  saveCacheStore({
    ...store,
    podcastDetails: {
      ...store.podcastDetails,
      [podcastId]: {
        timestamp: now,
        data: podcastDetail,
      },
    },
  });

  return podcastDetail;
}