import NotificationItem from "../molecules/NotificationItem";
import EmptyState from "../molecules/EmptyState";
import { BellOff } from "lucide-react";

export default function NotificationList({ notifications, onMarkAsRead }) {
  if (notifications.length === 0) {
    return <EmptyState title="No tienes notificaciones" icon={BellOff} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
