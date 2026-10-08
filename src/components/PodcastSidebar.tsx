import { Link } from "react-router-dom";
import type { Podcast } from "../types/podcast";
import "./PodcastSidebar.css";

interface PodcastSidebarProps {
  podcast: Podcast;
}

export function PodcastSidebar({ podcast }: PodcastSidebarProps) {
  return (
    <aside className="podcast-sidebar">
      <Link to={`/podcast/${podcast.id}`}>
        <img
          src={podcast.artworkUrl}
          alt=""
          className="podcast-sidebar-image"
        />

        <h1 className="podcast-sidebar-title">{podcast.title}</h1>

        <p className="podcast-sidebar-author">by {podcast.author}</p>
      </Link>

      <div className="podcast-sidebar-description">
        <p className="podcast-sidebar-description-title">Description:</p>
        <p className="podcast-sidebar-description-text">
          {podcast.description}
        </p>
      </div>
    </aside>
  );
}