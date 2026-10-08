import { useParams } from "react-router-dom";
import { EpisodeList } from "../../components/EpisodeList";
import { usePodcastDetail } from "../../hooks/usePodcastDetail";
import { PodcastSidebar } from "../../components/PodcastSidebar";
import "./PodcastDetailView.css";

export function PodcastDetailView() {
  const { podcastId } = useParams<{ podcastId: string }>();

  const { podcastDetail, loading, error } = usePodcastDetail(podcastId ?? "");

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error);
    return null;
  }

  if (!podcastDetail) {
    return null;
  }

  const { podcast, episodes } = podcastDetail;

  return (
    <main className="podcast-detail-view">
      <PodcastSidebar podcast={podcast} />

      <section>
        <div className="podcast-detail-header">
          <h2 className="podcast-detail-title">
            Episodes: {episodes.length}
          </h2>
        </div>

        <div className="podcast-detail-list">
          <EpisodeList podcastId={podcast.id} episodes={episodes} />
        </div>
      </section>
    </main>
  );
}