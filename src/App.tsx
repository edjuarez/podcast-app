import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/Header'

function getRouteAnnouncement(pathname: string): string {
  if (pathname === '/') {
    return 'Top podcasts'
  }

  const episodeMatch = pathname.match(
    /^\/podcast\/([^/]+)\/episode\/([^/]+)$/,
  )

  if (episodeMatch) {
    return `Episode ${episodeMatch[2]} from podcast ${episodeMatch[1]}`
  }

  const podcastMatch = pathname.match(/^\/podcast\/([^/]+)$/)

  if (podcastMatch) {
    return `Podcast ${podcastMatch[1]}`
  }

  return 'Page not found'
}

function App() {
  const { pathname } = useLocation()

  return (
    <>
      <Header />

      <p role="status" className="sr-only">
        {getRouteAnnouncement(pathname)}
      </p>

      <Outlet />
    </>
  )
}

export default App