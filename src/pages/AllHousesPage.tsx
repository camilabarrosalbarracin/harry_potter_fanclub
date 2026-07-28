import type { House } from "../api/wizardWorldApi";
import ErrorState from "../components/ErrorState";
import HouseCard from "../components/HouseCard";
import Loader from "../components/Loader";
import styles from "./AllHousesPage.module.css";

interface AllHousesPageProps {
  houses: House[];
  loading: boolean;
  error: string | null;
}

export default function AllHousesPage({ houses, loading, error }: AllHousesPageProps) {
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
