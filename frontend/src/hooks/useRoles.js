import { useCallback, useEffect, useState } from "react";
import { rolesApi } from "../api/rolesApi";

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rolesApi.list();
      setRoles(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const removeRole = useCallback(async (id) => {
    await rolesApi.remove(id);
    setRoles((current) => current.filter((role) => role.id !== id));
  }, []);

  return { roles, isLoading, error, refetch: fetchRoles, removeRole };
}
