import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PODCAST_ID } from "../../test/fixtures/podcasts";
import { renderApp } from "../../test/renderApp";

async function renderLoadedPodcastDetail() {
  const result = renderApp(`/podcast/${PODCAST_ID}`);

  await screen.findByRole("table");

  return result;
}

describe("PodcastDetailView", () => {
  it("shows the podcast information in the sidebar", async () => {
    await renderLoadedPodcastDetail();

    const sidebar = screen.getByRole("complementary");

    expect(
      within(sidebar).getByRole("heading", { name: "Test Podcast" }),
    ).toBeInTheDocument();
    expect(sidebar.querySelector("img")).toBeInTheDocument();
    expect(sidebar).toHaveTextContent("by Test Author");
    expect(sidebar).toHaveTextContent("Default feed description");
  });

  it("shows the episode count and renders the episode list", async () => {
    await renderLoadedPodcastDetail();

    expect(
      screen.getByRole("heading", { name: "Episodes: 3" }),
    ).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      4,
    );
    expect(screen.getByRole("link", { name: "Episode 1" })).toBeInTheDocument();
  });

  it("navigates to the episode detail when an episode is clicked", async () => {
    const user = userEvent.setup();
    const { router } = await renderLoadedPodcastDetail();

    await user.click(screen.getByRole("link", { name: "Episode 2" }));

    expect(router.state.location.pathname).toBe(
      `/podcast/${PODCAST_ID}/episode/987654323`,
    );
  });
});
