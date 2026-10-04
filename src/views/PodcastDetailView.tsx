import { useParams } from 'react-router-dom'
import { EpisodeList } from '../components/EpisodeList'
import { usePodcastDetail } from '../hooks/usePodcastDetail'
import { PodcastSidebar } from '../components/PodcastSidebar'

export function PodcastDetailView() {
  const { podcastId } = useParams<{ podcastId: string }>()

  const {
    podcastDetail,
    loading,
    error,
  } = usePodcastDetail(podcastId ?? '')

  if (loading) {
    return null
  }

  if (error) {
    console.error(error)
    return null
  }

  if (!podcastDetail) {
    return null
  }

  const { podcast, episodes } = podcastDetail

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-8">
      <PodcastSidebar podcast={podcast} />

      <section>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">
            Episodes: {episodes.length}
          </h2>
        </div>

        <div className="mt-6">
          <EpisodeList
            podcastId={podcast.id}
            episodes={episodes}
          />
        </div>
      </section>
    </main>
  )
}