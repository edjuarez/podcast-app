import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { TOP_PODCASTS_ENDPOINT, server } from "../../test/msw";
import { topPodcastsResponse } from "../../test/fixtures/podcasts";
import { renderApp } from "../../test/renderApp";

function getHeaderIndicators() {
  const headerRow = screen.getByRole("banner").firstElementChild as HTMLElement;

  return Array.from(headerRow.children).filter(
    (child) => child.tagName !== "A",
  );
}

async function renderLoadedHome() {
  const result = renderApp("/");

  await screen.findAllByRole("listitem");

  return {
    ...result,
    filter: screen.getByRole("textbox", { name: "Filter podcasts" }),
  };
}

describe("HomeView", () => {
  it("renders one card per podcast returned by the API", async () => {
    await renderLoadedHome();

    const cards = screen.getAllByRole("listitem");

    expect(cards).toHaveLength(100);

    const [firstCard] = cards;

    expect(
      within(firstCard).getByRole("heading", { name: "Podcast 1" }),
    ).toBeInTheDocument();
    expect(firstCard).toHaveTextContent("Author: Author 1");
  });

  it("shows a loading indicator in the header until the podcasts are fetched", async () => {
    server.use(
      http.get(TOP_PODCASTS_ENDPOINT, async () => {
        await delay(50);

        return HttpResponse.json(topPodcastsResponse());
      }),
    );

    renderApp("/");

    expect(getHeaderIndicators()).toHaveLength(1);

    await screen.findAllByRole("listitem");

    await waitFor(() => {
      expect(getHeaderIndicators()).toHaveLength(0);
    });
  });

  it("filters the podcasts by title", async () => {
    const user = userEvent.setup();
    const { filter } = await renderLoadedHome();

    await user.type(filter, "Podcast 42");

    expect(
      screen.getByRole("heading", { name: "Podcast 42" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Podcast 43" }),
    ).not.toBeInTheDocument();
  });

  it("filters the podcasts by author and updates the result count", async () => {
    const user = userEvent.setup();
    const { filter } = await renderLoadedHome();

    expect(screen.getByText("100")).toBeInTheDocument();

    await user.type(filter, "Author 3");

    expect(screen.getAllByRole("listitem")).toHaveLength(20);
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("navigates to the podcast detail when a card is clicked", async () => {
    const user = userEvent.setup();
    const { router } = await renderLoadedHome();

    await user.click(screen.getByRole("heading", { name: "Podcast 42" }));

    expect(router.state.location.pathname).toBe("/podcast/1041");
  });
});
