import { useCallback, useEffect, useState } from "react";
import { schedulesApi } from "../api/schedulesApi";

export function useSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await schedulesApi.list();
      setSchedules(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const removeSchedule = useCallback(async (id) => {
    await schedulesApi.remove(id);
    setSchedules((current) => current.filter((schedule) => schedule.id !== id));
  }, []);

  const updateOperationalStatus = useCallback(async (id, operationalStatus) => {
    const response = await schedulesApi.updateOperationalStatus(id, operationalStatus);
    setSchedules((current) =>
      current.map((schedule) => (schedule.id === id ? response.data : schedule)),
    );
    return response.data;
  }, []);

  return {
    schedules,
    isLoading,
    error,
    refetch: fetchSchedules,
    removeSchedule,
    updateOperationalStatus,
  };
}
