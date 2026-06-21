import { useNotifications } from "../hooks/useNotifications";
import NotificationList from "../components/organisms/NotificationList";
import PageHeader from "../components/molecules/PageHeader";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";

export default function NotificationsPage() {
  const { notifications, isLoading, error, markAsRead } = useNotifications();

  return (
    <div>
      <PageHeader title="Notificaciones" description="Mantente al dia con los cambios en tus agendas." />
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {error && <Alert tone="error">No fue posible cargar las notificaciones.</Alert>}
      {!isLoading && !error && (
        <NotificationList notifications={notifications} onMarkAsRead={markAsRead} />
      )}
    </div>
  );
}
