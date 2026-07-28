import { useMemo, useState } from "react";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import { getElixirs, type Elixir } from "../api/wizardWorldApi";
import { useApiList } from "../hooks/useApiList";
import { getDifficultyBadge } from "../utils/elixirDifficulty";
import styles from "./PotionsPage.module.css";

export default function PotionsPage() {
  const { data: allElixirs, loading, error } = useApiList(getElixirs, "Could not load the potions");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  // Only potions with every attribute the card actually shows (name,
  // effect, a real difficulty, at least one ingredient and one inventor) —
  // partial records are left out instead of showing empty sections.
  const elixirs = useMemo(
    () =>
      allElixirs.filter(
        (elixir) =>
          Boolean(elixir.name) &&
          Boolean(elixir.effect) &&
          elixir.difficulty !== "Unknown" &&
          elixir.ingredients.length > 0 &&
          elixir.inventors.some((inventor) => inventor.firstName || inventor.lastName)
      ),
    [allElixirs]
  );

  const difficulties = useMemo(() => {
    const unique = new Set(elixirs.map((elixir) => elixir.difficulty));
    return Array.from(unique).sort();
  }, [elixirs]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return elixirs.filter((elixir) => {
      const matchesQuery = !query || elixir.name?.toLowerCase().includes(query);
      const matchesDifficulty = !difficultyFilter || elixir.difficulty === difficultyFilter;
      return matchesQuery && matchesDifficulty;
    });
  }, [elixirs, search, difficultyFilter]);

  return (
    <main className="page">
      <header className={styles.header}>
        <h1>The Potions Cabinet 🧪</h1>
        <p className="text-muted">
          From Polyjuice to Felix Felicis — every potion has a difficulty, a list of
          ingredients, and sometimes a name attached to whoever brewed it first.
        </p>
      </header>

      {loading && <Loader />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <>
          <div className={styles.controls}>
            <input
              className={`input ${styles.searchInput}`}
              type="search"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              aria-label="Filter by difficulty"
            >
              <option value="">All difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {getDifficultyBadge(difficulty).label}
                </option>
              ))}
            </select>
          </div>

          <p className={`text-muted ${styles.count}`}>
            {filtered.length} potion{filtered.length === 1 ? "" : "s"}
          </p>

          <div className={styles.grid}>
            {filtered.map((elixir) => (
              <PotionCard key={elixir.id} elixir={elixir} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function PotionCard({ elixir }: { elixir: Elixir }) {
  const badge = getDifficultyBadge(elixir.difficulty);
  const inventors = elixir.inventors
    .map((inventor) => [inventor.firstName, inventor.lastName].filter(Boolean).join(" "))
    .filter(Boolean);

  return (
    <article className={`card elev-sm ${styles.card}`}>
      <div className="card-title">{elixir.name}</div>
      <span className={`tag ${badge.tagClass} ${styles.difficultyBadge}`}>{badge.label}</span>
      <p className="card-body">{elixir.effect}</p>

      <div className={styles.ingredients}>
        {elixir.ingredients.map((ingredient) => (
          <span key={ingredient.id} className="tag tag-outline">
            {ingredient.name}
          </span>
        ))}
      </div>

      <p className={`text-muted ${styles.inventor}`}>Invented by {inventors.join(", ")}</p>
    </article>
  );
}
