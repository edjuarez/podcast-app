import { useParams } from 'react-router-dom'
import { PodcastSidebar } from '../components/PodcastSidebar'
import { usePodcastDetail } from '../hooks/usePodcastDetail'

export function EpisodeDetailView() {
  const { podcastId, episodeId } = useParams<{
    podcastId: string
    episodeId: string
  }>()

  const {
    podcastDetail,
    loading,
    error,
  } = usePodcastDetail(podcastId ?? '')

  if (loading) {
    return <p className="p-8">Loading...</p>
  }

  if (error) {
    console.error(error)
    return null
  }

  if (!podcastDetail) {
    return null
  }

  const { podcast, episodes } = podcastDetail

  const episode = episodes.find(
    (episode) => episode.id === episodeId,
  )

  if (!episode) {
    return null
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-8 items-start">
      <PodcastSidebar podcast={podcast} />

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">
          {episode.title}
        </h1>

        <div
          className="mt-6"
          dangerouslySetInnerHTML={{
            __html: episode.description,
          }}
        />

        <audio
          controls
          className="mt-6 w-full"
          src={episode.audioUrl}
        />
      </section>
    </main>
  )
}