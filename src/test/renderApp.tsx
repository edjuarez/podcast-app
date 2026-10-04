import { render } from '@testing-library/react'
import {
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom'
import { EpisodeDetailView } from '../views/EpisodeDetailView'
import { HomeView } from '../views/HomeView'
import { PodcastDetailView } from '../views/PodcastDetailView'

export function renderApp(initialPath = '/') {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HomeView /> },
      { path: '/podcast/:podcastId', element: <PodcastDetailView /> },
      {
        path: '/podcast/:podcastId/episode/:episodeId',
        element: <EpisodeDetailView />,
      },
    ],
    { initialEntries: [initialPath] },
  )

  return { router, ...render(<RouterProvider router={router} />) }
}