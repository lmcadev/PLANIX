import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, BellRing } from 'lucide-react';
import { notificationsApi } from '~/api/notifications';
import { extractErrorMessage } from '~/lib/apiClient';
import { unwrapList, cn } from '~/lib/utils';
import { formatDateTime } from '~/lib/date';
import type { Notification } from '~/types';
import { Spinner } from '~/components/ui/spinner';
import { EmptyState } from '~/components/empty-state';
import { Badge } from '~/components/ui/badge';
import { useAuthStore } from '~/store/authStore';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore((s) => ({ isAuthenticated: s.isAuthenticated }));
  console.log('NotificationsPage: isAuthenticated=', isAuthenticated);

  useEffect(() => {
    notificationsApi
      .list()
      .then(({ data }) => setNotifications(unwrapList(data)))
      .catch((err) => toast.error(extractErrorMessage(err, 'No se pudieron cargar las notificaciones.')))
      .finally(() => setIsLoading(false));
  }, []);

  async function markRead(notification: Notification) {
    if (notification.is_read) return;
    try {
      const { data } = await notificationsApi.markRead(notification.id);
      setNotifications((prev) => prev.map((n) => (n.id === data.id ? data : n)));
    } catch (err) {
      toast.error(extractErrorMessage(err, 'No se pudo marcar como leida.'));
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-display text-xl font-semibold text-ink-900'>Notificaciones</h1>
        <p className='text-sm text-muted'>Avisos sobre las agendas asignadas a ti.</p>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-16'>
          <Spinner />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title='No tienes notificaciones' />
      ) : (
        <div className='divide-y divide-line rounded-lg border border-line bg-surface'>
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markRead(notification)}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-paper',
                !notification.is_read && 'bg-signal-50/50',
              )}>
              <span
                className={cn(
                  'mt-0.5 flex size-8 flex-shrink-0 items-center justify-center rounded-full',
                  notification.is_read ? 'bg-paper text-muted' : 'bg-signal-100 text-signal-700',
                )}>
                {notification.is_read ? <Bell className='size-4' /> : <BellRing className='size-4' />}
              </span>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center justify-between gap-2'>
                  <p className='truncate text-sm font-medium text-ink-900'>{notification.title}</p>
                  {!notification.is_read ? <Badge variant='signal'>Nueva</Badge> : null}
                </div>
                <p className='mt-0.5 text-sm text-muted'>{notification.message}</p>
                <p className='mt-1 font-mono-data text-xs text-muted'>{formatDateTime(notification.created_at)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
