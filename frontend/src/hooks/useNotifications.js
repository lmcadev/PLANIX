import { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "../api/notificationsApi";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.list();
      setNotifications(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    const response = await notificationsApi.markAsRead(id);
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? response.data : notification)),
    );
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  return { notifications, isLoading, error, refetch: fetchNotifications, markAsRead, unreadCount };
}
