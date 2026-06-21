import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { ROUTES } from "../../constants/routes";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-3.5 backdrop-blur-sm">
      <p className="text-sm text-slate-500">
        Bienvenido, <span className="font-semibold text-slate-900">{user?.first_name}</span>
      </p>
      <div className="flex items-center gap-4">
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Link>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2.5">
          <Avatar firstName={user?.first_name} lastName={user?.last_name} size={34} />
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </Button>
      </div>
    </header>
  );
}
