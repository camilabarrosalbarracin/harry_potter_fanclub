import { useEffect, useRef } from "react";
import type { House } from "../api/wizardWorldApi";
import ErrorState from "../components/ErrorState";
import HouseCard from "../components/HouseCard";
import Loader from "../components/Loader";
import { getUserProfile, wasSortingHatShownThisSession } from "../utils/identity";
import styles from "./HomePage.module.css";

interface HomePageProps {
  houses: House[];
  loading: boolean;
  error: string | null;
  onAutoOpenSorting: () => void;
}

export default function HomePage({ houses, loading, error, onAutoOpenSorting }: HomePageProps) {
  const hasAutoOpened = useRef(false);

  // Solo se dispara una vez, y solo si el usuario sigue anónimo (sin
  // userProfile) y no lo cerró ya dentro de esta misma sesión de pestaña.
  // Espera a que las casas hayan cargado porque el modal las necesita
  // para resolver el id de la casa asignada al llegar al resultado.
  useEffect(() => {
    if (hasAutoOpened.current || loading || error || houses.length === 0) return;
    if (getUserProfile() || wasSortingHatShownThisSession()) return;
    hasAutoOpened.current = true;
    onAutoOpenSorting();
  }, [loading, error, houses, onAutoOpenSorting]);

  return (
    <main className="page">
      <header className={styles.header}>
        <h1>Houses of Hogwarts</h1>
        <p className="text-muted">
          Four houses, four legends. Discover the values, founders and souls that define each
          one, ever since the Sorting Hat first spoke their name.
        </p>
      </header>

      {loading && <Loader />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <div className={styles.grid}>
          {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      )}
    </main>
  );
}
