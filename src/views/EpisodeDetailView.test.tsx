import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PODCAST_ID } from '../test/fixtures/podcasts'
import { renderApp } from '../test/renderApp'

async function renderLoadedEpisodeDetail() {
  const result = renderApp(`/podcast/${PODCAST_ID}/episode/987654322`)

  await screen.findByRole('heading', { name: 'Episode 1' })

  return result
}

describe('EpisodeDetailView', () => {
  it('shows the episode title and renders its description as HTML', async () => {
    await renderLoadedEpisodeDetail()

    expect(
      screen.getByRole('heading', { name: 'Episode 1' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('<p>Episode <b>description</b></p>'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('description').tagName).toBe('B')
  })

  it('renders the HTML5 audio player with the episode audio url', async () => {
    const { container } = await renderLoadedEpisodeDetail()

    expect(container.querySelector('audio')).toHaveAttribute(
      'src',
      'https://audio.test/1.mp3',
    )
  })

  it('shows the podcast sidebar and navigates back to the podcast detail', async () => {
    const user = userEvent.setup()
    const { router } = await renderLoadedEpisodeDetail()

    const sidebar = screen.getByRole('complementary')

    expect(
      within(sidebar).getByRole('heading', { name: 'Test Podcast' }),
    ).toBeInTheDocument()
    expect(sidebar).toHaveTextContent('by Test Author')

    await user.click(
      within(sidebar).getByRole('heading', { name: 'Test Podcast' }),
    )

    expect(router.state.location.pathname).toBe(`/podcast/${PODCAST_ID}`)
  })
})