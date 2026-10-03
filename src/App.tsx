import { Route, Routes } from 'react-router-dom'
import { HomeView } from './views/HomeView'
import { PodcastDetailView } from './views/PodcastDetailView'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeView />}
      />

      <Route
        path="/podcast/:podcastId"
        element={<PodcastDetailView />}
      />
    </Routes>
  )
}

export default App