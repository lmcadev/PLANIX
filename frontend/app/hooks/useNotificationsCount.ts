import { useEffect, useState } from "react";
import { notificationsApi } from "~/api/notifications";
import { unwrapList } from "~/lib/utils";
import { useAuthStore } from "~/store/authStore";

const POLL_MS = 30_000;

/** Cuenta notificaciones sin leer del usuario actual, refrescando cada 30s. */
export function useNotificationsCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function fetchUnread() {
      try {
        const { data } = await notificationsApi.list();
        if (!cancelled) {
          setUnread(unwrapList(data).filter((n) => !n.is_read).length);
        }
      } catch {
        // si falla el polling no interrumpimos el resto de la app
      }
    }

    fetchUnread();
    const id = setInterval(fetchUnread, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isAuthenticated]);

  return unread;
}
