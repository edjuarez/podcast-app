import { renderHook, waitFor } from "@testing-library/react";
import { getPodcastDetail } from "../services/podcastService";
import { usePodcastDetail } from "./usePodcastDetail";

vi.mock("../services/podcastService", () => ({
  getPodcastDetail: vi.fn(),
}));

const mockedGetPodcastDetail = vi.mocked(getPodcastDetail);

const PODCAST_ID = "123";

const PODCAST_DETAIL = {
  podcast: {
    id: PODCAST_ID,
    title: "Test Podcast",
    author: "Test Author",
    artworkUrl: "image.jpg",
    description: "Test description",
  },
  episodes: [],
};

describe("usePodcastDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts loading and returns podcast detail when the request succeeds", async () => {
    mockedGetPodcastDetail.mockResolvedValue(PODCAST_DETAIL);

    const { result } = renderHook(() => usePodcastDetail(PODCAST_ID));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.podcastDetail).toEqual(PODCAST_DETAIL);
    expect(result.current.error).toBeNull();
  });

  it("returns an error when the request fails", async () => {
    const error = new Error("Failed to fetch podcast detail");

    mockedGetPodcastDetail.mockRejectedValue(error);

    const { result } = renderHook(() => usePodcastDetail(PODCAST_ID));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.podcastDetail).toBeNull();
    expect(result.current.error).toEqual(error);
  });

  it("reloads the podcast detail when the podcast id changes", async () => {
    const secondPodcastId = "456";

    mockedGetPodcastDetail
      .mockResolvedValueOnce(PODCAST_DETAIL)
      .mockResolvedValueOnce({
        ...PODCAST_DETAIL,
        podcast: {
          ...PODCAST_DETAIL.podcast,
          id: secondPodcastId,
        },
      });

    const { result, rerender } = renderHook(
      ({ podcastId }) => usePodcastDetail(podcastId),
      {
        initialProps: { podcastId: PODCAST_ID },
      },
    );

    await waitFor(() => {
      expect(result.current.podcastDetail?.podcast.id).toBe(PODCAST_ID);
    });

    rerender({ podcastId: secondPodcastId });

    await waitFor(() => {
      expect(result.current.podcastDetail?.podcast.id).toBe(secondPodcastId);
    });
  });
});