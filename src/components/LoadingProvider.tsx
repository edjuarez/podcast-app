import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ViewLoadingContext } from '../hooks/useViewLoading'

interface LoadingProviderProps {
  children: ReactNode
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [loadingViews, setLoadingViews] = useState<string[]>([])

  const setViewLoading = useCallback((id: string, loading: boolean) => {
    setLoadingViews((views) => {
      if (loading) {
        return views.includes(id) ? views : [...views, id]
      }

      return views.filter((view) => view !== id)
    })
  }, [])

  const value = useMemo(
    () => ({
      isLoading: loadingViews.length > 0,
      setViewLoading,
    }),
    [loadingViews, setViewLoading],
  )

  return (
    <ViewLoadingContext.Provider value={value}>
      {children}
    </ViewLoadingContext.Provider>
  )
}