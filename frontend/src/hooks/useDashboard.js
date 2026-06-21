import { useCallback, useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";

export function useDashboard() {
  const [kpis, setKpis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKpis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getKpis();
      setKpis(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return { kpis, isLoading, error, refetch: fetchKpis };
}
