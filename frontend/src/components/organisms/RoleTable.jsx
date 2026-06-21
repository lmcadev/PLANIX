import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Button from "../atoms/Button";
import Badge from "../atoms/Badge";
import EmptyState from "../molecules/EmptyState";
import { buildRoute, ROUTES } from "../../constants/routes";

export default function RoleTable({ roles, canManage, onDelete }) {
  if (roles.length === 0) {
    return <EmptyState title="No hay roles registrados" />;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5">Nombre</th>
            <th className="px-5 py-3.5">Descripcion</th>
            <th className="px-5 py-3.5">Permisos</th>
            {canManage && <th className="px-5 py-3.5">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {roles.map((role) => (
            <tr key={role.id} className="transition-colors hover:bg-slate-50/60">
              <td className="px-5 py-3.5 font-medium text-slate-900">{role.name}</td>
              <td className="px-5 py-3.5 text-slate-600">{role.description}</td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <Badge key={permission.id} tone="blue">
                      {permission.code}
                    </Badge>
                  ))}
                </div>
              </td>
              {canManage && (
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Link to={buildRoute(ROUTES.ROLE_EDIT, { id: role.id })}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </Button>
                    </Link>
                    <Button variant="danger" size="sm" onClick={() => onDelete(role.id)}>
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
