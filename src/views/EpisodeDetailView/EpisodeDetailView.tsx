import { useParams } from "react-router-dom";
import { PodcastSidebar } from "../../components/PodcastSidebar";
import { usePodcastDetail } from "../../hooks/usePodcastDetail";
import "./EpisodeDetailView.css";

export function EpisodeDetailView() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();

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

  const episode = episodes.find((episode) => episode.id === episodeId);

  if (!episode) {
    return null;
  }

  return (
    <main className="episode-view">
      <PodcastSidebar podcast={podcast} />

      <section className="episode-content">
        <h1 className="episode-title">{episode.title}</h1>

        <div
          className="episode-description"
          dangerouslySetInnerHTML={{
            __html: episode.description,
          }}
        />

        <audio
          controls
          className="episode-audio"
          src={episode.audioUrl}
        />
      </section>
    </main>
  );
}
