import { useState } from "react";
import { PodcastCard } from "../../components/PodcastCard";
import { PodcastFilter } from "../../components/PodcastFilter";
import { useTopPodcasts } from "../../hooks/useTopPodcasts";
import "./HomeView.css";

export function HomeView() {
  const { podcasts, loading, error } = useTopPodcasts();
  const [filter, setFilter] = useState("");

  if (loading) {
    return null;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredPodcasts = podcasts.filter((podcast) => {
    return (
      podcast.title.toLowerCase().includes(normalizedFilter) ||
      podcast.author.toLowerCase().includes(normalizedFilter)
    );
  });

  return (
    <main className="home-view">

      <PodcastFilter
        value={filter}
        podcastCount={filteredPodcasts.length}
        onChange={setFilter}
      />

      <ul className="podcast-list">
        {filteredPodcasts.map((podcast) => (
          <li key={podcast.id}>
            <PodcastCard podcast={podcast} />
          </li>
        ))}
      </ul>
    </main>
  );
}