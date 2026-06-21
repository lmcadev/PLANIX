import { useCallback, useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await usersApi.list();
      setUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const removeUser = useCallback(async (id) => {
    await usersApi.remove(id);
    setUsers((current) => current.filter((user) => user.id !== id));
  }, []);

  return { users, isLoading, error, refetch: fetchUsers, removeUser };
}
