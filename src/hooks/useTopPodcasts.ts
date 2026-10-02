import { useEffect, useState } from 'react'
import type { Podcast } from '../types/podcast'
import { getTopPodcasts } from '../services/podcastService'

export function useTopPodcasts() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadPodcasts() {
      try {
        const data = await getTopPodcasts()
        setPodcasts(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error('Unknown error')
        )
      } finally {
        setLoading(false)
      }
    }

    loadPodcasts()
  }, [])

  return {
    podcasts,
    loading,
    error,
  }
}