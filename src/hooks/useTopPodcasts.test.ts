import { renderHook, waitFor } from "@testing-library/react";
import { getTopPodcasts } from "../services/podcastService";
import { useTopPodcasts } from "./useTopPodcasts";

vi.mock("../services/podcastService", () => ({
  getTopPodcasts: vi.fn(),
}));

const mockedGetTopPodcasts = vi.mocked(getTopPodcasts);

const PODCASTS = [
  {
    id: "1",
    title: "Test Podcast",
    author: "Test Author",
    artworkUrl: "image.jpg",
    description: "Test description",
  },
];

describe("useTopPodcasts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts loading and returns podcasts when the request succeeds", async () => {
    mockedGetTopPodcasts.mockResolvedValue(PODCASTS);

    const { result } = renderHook(() => useTopPodcasts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.podcasts).toEqual(PODCASTS);
    expect(result.current.error).toBeNull();
  });

  it("returns an error when the request fails", async () => {
    const error = new Error("Failed to fetch podcasts");

    mockedGetTopPodcasts.mockRejectedValue(error);

    const { result } = renderHook(() => useTopPodcasts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.podcasts).toEqual([]);
    expect(result.current.error).toEqual(error);
  });
});