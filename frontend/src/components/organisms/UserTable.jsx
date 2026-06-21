import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import RoleChip from "../molecules/RoleChip";
import EmptyState from "../molecules/EmptyState";
import { buildRoute, ROUTES } from "../../constants/routes";

export default function UserTable({ users, canManage, onDelete }) {
  if (users.length === 0) {
    return <EmptyState title="No hay usuarios registrados" />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5">Nombre</th>
            <th className="px-5 py-3.5">Correo</th>
            <th className="px-5 py-3.5">Roles</th>
            <th className="px-5 py-3.5">Estado</th>
            {canManage && <th className="px-5 py-3.5">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-5 py-3.5 font-medium text-slate-900">
                <div className="flex items-center gap-2.5">
                  <Avatar firstName={user.first_name} lastName={user.last_name} size={28} />
                  {user.first_name} {user.last_name}
                </div>
              </td>
              <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <RoleChip key={role.id} role={role} />
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5">
                <Badge tone={user.is_active ? "green" : "red"}>
                  {user.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              {canManage && (
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Link to={buildRoute(ROUTES.USER_EDIT, { id: user.id })}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => onDelete(user.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
