import { Bell, Check } from "lucide-react";
import { cx } from "../../utils/classNames";
import { formatDateTime } from "../../utils/formatDate";
import Button from "../atoms/Button";

export default function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div
      className={cx(
        "flex items-start gap-4 rounded-2xl border px-4 py-4 transition-colors duration-150",
        notification.is_read ? "border-slate-200/70 bg-white" : "border-primary-200 bg-primary-50/60",
      )}
    >
      <div
        className={cx(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          notification.is_read ? "bg-slate-100 text-slate-400" : "bg-primary-100 text-primary-600",
        )}
      >
        <Bell className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
        <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
        <p className="mt-2 text-xs text-slate-400">{formatDateTime(notification.created_at)}</p>
      </div>
      {!notification.is_read && (
        <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
          <Check className="h-3.5 w-3.5" />
          Marcar leida
        </Button>
      )}
    </div>
  );
}
