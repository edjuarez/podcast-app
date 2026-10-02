import { PodcastCard } from '../components/PodcastCard/PodcastCard'
import { useTopPodcasts } from '../hooks/useTopPodcasts'

export function HomeView() {
  const { podcasts, loading, error } = useTopPodcasts()

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    console.error(error)
    return null
  }

  return (
    <main>
      <h1>Top Podcasts</h1>

      <section>
        {podcasts.map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
          />
        ))}
      </section>
    </main>
  )
}