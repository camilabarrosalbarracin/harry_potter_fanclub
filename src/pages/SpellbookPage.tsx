import { useMemo, useState } from "react";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import { getSpells, type Spell } from "../api/wizardWorldApi";
import { useApiList } from "../hooks/useApiList";
import { getSpellLightColor, hasVisibleLight, isRainbowLight } from "../utils/spellLight";
import { getSpellTypeLabel } from "../utils/spellType";
import { AnalyticsEvent, trackEvent } from "../utils/analytics";
import styles from "./SpellbookPage.module.css";

export default function SpellbookPage() {
  const { data: allSpells, loading, error } = useApiList(getSpells, "Could not load the spells");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [castSpell, setCastSpell] = useState<Spell | null>(null);

  // Only spells that have every attribute the card actually shows (name,
  // incantation, effect, a real type, and a visible light). Partial
  // records are left out instead of showing gaps like "Effect unknown.".
  const spells = useMemo(
    () =>
      allSpells.filter(
        (spell) =>
          Boolean(spell.name) &&
          Boolean(spell.incantation) &&
          Boolean(spell.effect) &&
          spell.type !== "None" &&
          hasVisibleLight(spell.light)
      ),
    [allSpells]
  );

  const types = useMemo(() => {
    const unique = new Set(spells.map((spell) => spell.type).filter((type) => type && type !== "None"));
    return Array.from(unique).sort();
  }, [spells]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return spells.filter((spell) => {
      const matchesQuery =
        !query ||
        spell.name?.toLowerCase().includes(query) ||
        spell.incantation?.toLowerCase().includes(query);
      const matchesType = !typeFilter || spell.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [spells, search, typeFilter]);

  function handleCastRandom() {
    const pool = filtered.length > 0 ? filtered : spells;
    if (pool.length === 0) return;
    const spell = pool[Math.floor(Math.random() * pool.length)];
    trackEvent(AnalyticsEvent.CastRandomSpellClicked, { name: spell.name, type: spell.type });
    setCastSpell(spell);
  }

  return (
    <main className="page">
      <header className={styles.header}>
        <h1>The Spellbook 🪄</h1>
        <p className="text-muted">
          Every incantation has a story. Search the archive, or let the wand choose for you.
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
              placeholder="Search by name or incantation…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by spell type"
            >
              <option value="">All types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {getSpellTypeLabel(type)}
                </option>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={handleCastRandom}>
              Cast a random spell
            </button>
          </div>

          {castSpell && (
            <div className={`card elev-md ${styles.castCard}`}>
              <div className="card-kicker">You cast…</div>
              <SpellCard spell={castSpell} />
            </div>
          )}

          <p className={`text-muted ${styles.count}`}>
            {filtered.length} spell{filtered.length === 1 ? "" : "s"}
          </p>

          <div className={styles.grid}>
            {filtered.map((spell) => (
              <SpellCard key={spell.id} spell={spell} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function SpellCard({ spell }: { spell: Spell }) {
  const color = getSpellLightColor(spell.light);
  const rainbow = isRainbowLight(spell.light);

  return (
    <article className={`card elev-sm ${styles.card}`}>
      <div className={styles.cardHeader}>
        <div className="card-title">{spell.name ?? "Unnamed spell"}</div>
        {(color || rainbow) && (
          <span
            className={`${styles.lightSwatch} ${rainbow ? styles.lightRainbow : ""}`}
            style={color ? { background: color, boxShadow: `0 0 6px ${color}` } : undefined}
            title={spell.light}
          />
        )}
      </div>
      {spell.incantation && <p className={styles.incantation}>“{spell.incantation}”</p>}
      <p className="card-body">{spell.effect ?? "Effect unknown."}</p>
      {spell.type !== "None" && (
        <span className="tag tag-outline">{getSpellTypeLabel(spell.type)}</span>
      )}
    </article>
  );
}
