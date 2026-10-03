import { Route, Routes } from 'react-router-dom'
import { HomeView } from './views/HomeView'
import { PodcastDetailView } from './views/PodcastDetailView'
import { EpisodeDetailView } from './views/EpisodeDetailView'
import { Header } from './components/Header'

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={<HomeView />}
        />
        <Route
          path="/podcast/:podcastId"
          element={<PodcastDetailView />}
        />
        <Route
          path="/podcast/:podcastId/episode/:episodeId"
          element={<EpisodeDetailView />}
        />
      </Routes>
    </>
  )
}

export default App