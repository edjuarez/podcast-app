import "./PodcastFilter.css";

interface PodcastFilterProps {
  value: string;
  podcastCount: number;
  onChange: (value: string) => void;
}

export function PodcastFilter({
  value,
  podcastCount,
  onChange,
}: PodcastFilterProps) {
  return (
    <div className="podcast-filter">
      <span className="podcast-filter-count">{podcastCount}</span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter podcasts"
        placeholder="Filter podcasts..."
        className="podcast-filter-input"
      />
    </div>
  );
}