import { Link, useParams } from 'react-router-dom'
import { EpisodeList } from '../components/EpisodeList/EpisodeList'
import { usePodcastDetail } from '../hooks/usePodcastDetail'

export function PodcastDetailView() {
  const { podcastId } = useParams<{ podcastId: string }>()

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 grid lg:grid-cols-[280px_1fr] gap-8">
      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Link to={`/podcast/${podcast.id}`}>
          <img
            src={podcast.artworkUrl}
            alt={podcast.title}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </Link>

        <h1 className="mt-6 text-xl font-bold">
          {podcast.title}
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          by {podcast.author}
        </p>

        <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="font-medium text-gray-900">Description:</p>
            <p className="text-sm leading-6 text-gray-600">
            {podcast.description}
            </p>
        </div>
      </aside>

      <section>
        <h2 className="text-2xl font-bold">
          Episodes: {episodes.length}
        </h2>

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