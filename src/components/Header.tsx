import { Link } from "react-router-dom";
import { NavigationIndicator } from "./NavigationIndicator";
import "./Header.css";

export function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          Podcaster
        </Link>

        <NavigationIndicator />
      </div>
    </header>
  );
}