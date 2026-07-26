import { SparkleIcon } from "./icons";

interface NavBarProps {
  onOpenSorting: () => void;
}

// Global (lives in App, not HomePage) because the "Discover your house"
// button needs to open the Sorting flow from any page.
export default function NavBar({ onOpenSorting }: NavBarProps) {
  return (
    <nav className="nav">
      <span className="nav-brand">Harry Potter's Fans Club</span>
      <button type="button" className="btn btn-primary" onClick={onOpenSorting}>
        <SparkleIcon />
        Discover your house
      </button>
    </nav>
  );
}
