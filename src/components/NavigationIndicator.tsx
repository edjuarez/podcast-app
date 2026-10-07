import { useIsViewLoading } from "../hooks/useViewLoading";

export function NavigationIndicator() {
  const isLoading = useIsViewLoading();

  if (!isLoading) {
    return null;
  }

  return <div className="h-5 w-5 animate-pulse rounded-full bg-[#4897CE]" />;
}
