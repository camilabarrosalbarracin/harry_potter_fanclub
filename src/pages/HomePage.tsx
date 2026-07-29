import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { House } from "../api/wizardWorldApi";
import {
  getUserProfile,
  wasSortingHatShownThisSession,
  type UserProfile,
} from "../utils/identity";
import styles from "./HomePage.module.css";

interface HomePageProps {
  houses: House[];
  loading: boolean;
  error: string | null;
  profile: UserProfile | null;
  onOpenSorting: () => void;
}

// Overview of everything the fan club offers, based on the real Wizard
// World API resources.
interface ExploreSection {
  title: string;
  emoji: string;
  description: string;
  href: string;
}

const EXPLORE_SECTIONS: ExploreSection[] = [
  {
    title: "Houses",
    emoji: "🏰",
    description:
      "Take the Sorting Hat quiz and browse the four houses of Hogwarts: traits, founders, heads of house and common rooms.",
    href: "/allhouses",
  },
  {
    title: "Spellbook",
    emoji: "🪄",
    description:
      "Browse iconic spells and charms with their incantation, effect and type, from Alohomora to Expecto Patronum.",
    href: "/spellbook",
  },
  {
    title: "Potions Cabinet",
    emoji: "🧪",
    description:
      "Explore famous potions and elixirs, their ingredients, difficulty level and the wizards who invented them.",
    href: "/potions",
  },
];

export default function HomePage({ houses, loading, error, profile, onOpenSorting }: HomePageProps) {
  const hasAutoOpened = useRef(false);

  // Only fires once, and only if the user is still anonymous (no
  // userProfile) and hasn't already dismissed it in this same tab session.
  // Waits for the houses to load because the modal needs them to resolve
  // the assigned house's id when it reaches the result.
  useEffect(() => {
    if (hasAutoOpened.current || loading || error || houses.length === 0) return;
    if (getUserProfile() || wasSortingHatShownThisSession()) return;
    hasAutoOpened.current = true;
    onOpenSorting();
  }, [loading, error, houses, onOpenSorting]);

  return (
    <main className="page">
      <header className={styles.header}>
        <h1>{profile ? `Welcome, ${profile.firstName} ⚡` : "Welcome, fellow wizard ⚡"}</h1>
        <p className="text-muted">
          Your companion to the Wizarding World. Take the Sorting Hat quiz to discover your
          Hogwarts house, and explore everything else the fan club has to offer below.
        </p>
      </header>

      <section className={styles.exploreSection}>
        <h2 className={styles.sectionTitle}>What you'll find here</h2>
        <div className={styles.exploreGrid}>
          {EXPLORE_SECTIONS.map((section) => (
            <Link
              key={section.title}
              to={section.href}
              className={`card elev-sm ${styles.exploreCard}`}
            >
              <div className="card-title">
                {section.title} {section.emoji}
              </div>
              <p className="card-body">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
