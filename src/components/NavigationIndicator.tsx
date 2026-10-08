import { useIsViewLoading } from "../hooks/useViewLoading";
import "./NavigationIndicator.css";

export function NavigationIndicator() {
  const isLoading = useIsViewLoading();

  if (!isLoading) {
    return null;
  }

  return <div className="navigation-indicator" />;
}