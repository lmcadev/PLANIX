import { NavLink } from "react-router-dom";
import {
  CalendarClock,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cx } from "../../utils/classNames";
import { ROUTES } from "../../constants/routes";
import { ROLE_NAMES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.SCHEDULES, label: "Agendas", icon: CalendarClock },
  {
    to: ROUTES.USERS,
    label: "Usuarios",
    icon: Users,
    allowedRoles: [ROLE_NAMES.ADMIN],
  },
  {
    to: ROUTES.ROLES,
    label: "Roles",
    icon: ShieldCheck,
    allowedRoles: [ROLE_NAMES.ADMIN],
  },
  {
    to: ROUTES.PERMISSIONS,
    label: "Permisos",
    icon: KeyRound,
    allowedRoles: [ROLE_NAMES.ADMIN],
  },
];

export default function Sidebar() {
  const { userHasAnyRole } = useAuth();
  const items = NAV_ITEMS.filter((item) => userHasAnyRole(item.allowedRoles));

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-soft">
          P
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-slate-900">PLANIX</p>
          <p className="text-[11px] font-medium leading-tight text-slate-400">Gestion de agendas</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
