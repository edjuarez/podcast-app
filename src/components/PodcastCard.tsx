import { Link } from "react-router-dom";
import type { Podcast } from "../types/podcast";
import "./PodcastCard.css";

interface PodcastCardProps {
  podcast: Podcast;
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <Link to={`/podcast/${podcast.id}`} className="podcast-card-link">
      <article className="podcast-card">
        <div className="podcast-card-artwork">
          <img src={podcast.artworkUrl} alt="" />
        </div>

        <div className="podcast-card-content">
          <h2 className="podcast-card-title">{podcast.title}</h2>

          <p className="podcast-card-author">
            Author: {podcast.author}
          </p>
        </div>
      </article>
    </Link>
  );
}