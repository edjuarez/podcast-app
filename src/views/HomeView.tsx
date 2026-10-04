import { PodcastCard } from '../components/PodcastCard'
import { useTopPodcasts } from '../hooks/useTopPodcasts'
import { PodcastFilter } from '../components/PodcastFilter'
import { useState } from 'react'

export function HomeView() {
  const { podcasts, loading, error } = useTopPodcasts()
  const [filter, setFilter] = useState('')

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-2xl font-semibold text-gray-500">Loading...</p>
      </div>
    )
  }

  if (error) {
    console.error(error)
    return null
  }

  const normalizedFilter = filter.trim().toLowerCase()

  const filteredPodcasts = podcasts.filter((podcast) => {
    return (
      podcast.title.toLowerCase().includes(normalizedFilter) ||
      podcast.author.toLowerCase().includes(normalizedFilter)
    )
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="sr-only">Top Podcasts</h1>

      <PodcastFilter
        value={filter}
        podcastCount={filteredPodcasts.length}
        onChange={setFilter}
      />

      <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPodcasts.map((podcast) => (
          <li key={podcast.id}>
            <PodcastCard podcast={podcast} />
          </li>
        ))}
      </ul>
    </main>
  )
}