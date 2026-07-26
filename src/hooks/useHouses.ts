import { useEffect, useState } from "react";
import { getHouses, type House } from "../api/wizardWorldApi";

interface UseHousesResult {
  houses: House[];
  loading: boolean;
  error: string | null;
}

export function useHouses(): UseHousesResult {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evita setear estado si el componente se desmontó antes de que
    // resuelva el fetch (ej. navegación rápida a otra página).
    let cancelled = false;

    setLoading(true);
    setError(null);

    getHouses()
      .then((data) => {
        if (!cancelled) setHouses(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error loading the houses");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { houses, loading, error };
}
