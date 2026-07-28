import { useEffect, useState } from "react";

interface UseApiListResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Same loading/error pattern as useHouses, generalized for "fetch a full
// list once" — avoids repeating the boilerplate for Spells/Elixirs.
// Callers must pass a stable function reference (a module-level export,
// not an inline arrow) so the dependency array below doesn't refire on
// every render.
export function useApiList<T>(
  fetcher: () => Promise<T[]>,
  errorMessage: string
): UseApiListResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : errorMessage);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher, errorMessage]);

  return { data, loading, error };
}
