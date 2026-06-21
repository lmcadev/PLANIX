import { useCallback, useEffect, useState } from "react";
import { permissionsApi } from "../api/permissionsApi";

export function usePermissions() {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await permissionsApi.list();
      setPermissions(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const removePermission = useCallback(async (id) => {
    await permissionsApi.remove(id);
    setPermissions((current) => current.filter((permission) => permission.id !== id));
  }, []);

  return { permissions, isLoading, error, refetch: fetchPermissions, removePermission };
}
