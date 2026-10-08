import { Link } from "react-router-dom";
import type { Episode } from "../types/episode";
import "./EpisodeList.css";

interface EpisodeListProps {
  podcastId: string;
  episodes: Episode[];
}

function formatDuration(duration: number) {
  const totalMinutes = Math.floor(duration / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB");
}

export function EpisodeList({ podcastId, episodes }: EpisodeListProps) {
  return (
    <div className="episode-list">
      <table>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>

        <tbody>
          {episodes.map((episode) => (
            <tr key={episode.id}>
              <th scope="row">
                <Link to={`/podcast/${podcastId}/episode/${episode.id}`}>
                  {episode.title}
                </Link>
              </th>

              <td>{formatDate(episode.date)}</td>

              <td>{formatDuration(episode.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
