import { createContext, useContext, useEffect, useId } from 'react'

interface ViewLoadingContextValue {
  isLoading: boolean
  setViewLoading: (id: string, loading: boolean) => void
}

export const ViewLoadingContext = createContext<ViewLoadingContextValue>({
  isLoading: false,
  setViewLoading: () => undefined,
})

export function useReportViewLoading(loading: boolean) {
  const { setViewLoading } = useContext(ViewLoadingContext)
  const id = useId()

  useEffect(() => {
    setViewLoading(id, loading)

    return () => setViewLoading(id, false)
  }, [id, loading, setViewLoading])
}

export function useIsViewLoading() {
  return useContext(ViewLoadingContext).isLoading
}