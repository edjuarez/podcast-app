import { PodcastCard } from '../components/PodcastCard'
import { useTopPodcasts } from '../hooks/useTopPodcasts'
import { PodcastFilter } from '../components/PodcastFilter'
import { useState } from 'react'

export function HomeView() {
  const { podcasts, loading, error } = useTopPodcasts()
  const [filter, setFilter] = useState('')

  if (loading) {
    return <p>Loading...</p>
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
      <PodcastFilter
        value={filter}
        podcastCount={podcasts.length}
        onChange={setFilter}
      />

      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredPodcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
          />
        ))}
      </section>
    </main>
  )
}