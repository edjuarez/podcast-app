import { renderHook } from "@testing-library/react";
import {
  useReportViewLoading,
  ViewLoadingContext,
} from "./useViewLoading";

describe("useReportViewLoading", () => {
  it("reports the loading state to the context", () => {
    const setViewLoading = vi.fn();

    renderHook(() => useReportViewLoading(true), {
      wrapper: ({ children }) => (
        <ViewLoadingContext.Provider
          value={{
            isLoading: false,
            setViewLoading,
          }}
        >
          {children}
        </ViewLoadingContext.Provider>
      ),
    });

    expect(setViewLoading).toHaveBeenCalledWith(expect.any(String), true);
  });
});