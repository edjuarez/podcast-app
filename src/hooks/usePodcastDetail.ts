import { useEffect, useState } from "react";
import type { PodcastDetail } from "../types/podcast";
import { getPodcastDetail } from "../services/podcastService";
import { useReportViewLoading } from "./useViewLoading";

export function usePodcastDetail(podcastId: string) {
  const [podcastDetail, setPodcastDetail] = useState<PodcastDetail | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useReportViewLoading(loading);

  useEffect(() => {
    async function loadPodcastDetail() {
      try {
        setLoading(true);

        const data = await getPodcastDetail(podcastId);

        setPodcastDetail(data);
      } catch (error) {
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    loadPodcastDetail();
  }, [podcastId]);

  return {
    podcastDetail,
    loading,
    error,
  };
}
