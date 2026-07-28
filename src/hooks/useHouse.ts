import { useEffect, useState } from "react";
import { getHouseById, type House } from "../api/wizardWorldApi";

interface UseHouseResult {
  house: House | null;
  loading: boolean;
  error: string | null;
}

// Receives the house's real id (already resolved from the URL slug
// against the list) and fetches the canonical detail from /Houses/:id. If
// there's no id yet (the list hasn't loaded, or the slug doesn't match
// any house), it doesn't fire any fetch.
export function useHouse(id: string | undefined): UseHouseResult {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getHouseById(id)
      .then((data) => {
        if (!cancelled) setHouse(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error loading the house");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { house, loading, error };
}
