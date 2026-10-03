import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App'
import { HomeView } from './views/HomeView'
import { PodcastDetailView } from './views/PodcastDetailView'
import { EpisodeDetailView } from './views/EpisodeDetailView'
import './index.css'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeView />,
      },
      {
        path: '/podcast/:podcastId',
        element: <PodcastDetailView />,
      },
      {
        path: '/podcast/:podcastId/episode/:episodeId',
        element: <EpisodeDetailView />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)