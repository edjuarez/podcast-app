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
    <div className="flex items-center justify-end gap-3">
      <span className="rounded bg-[#2e79ad] px-3 py-1 text-base font-semibold text-white">
        {podcastCount}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter podcasts"
        placeholder="Filter podcasts..."
        className="w-full max-w-xs rounded border border-gray-500 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4897CE]"
      />
    </div>
  );
}
