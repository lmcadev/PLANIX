import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { usersApi } from "~/api/users";
import { rolesApi } from "~/api/roles";
import { extractErrorMessage } from "~/lib/apiClient";
import { unwrapList } from "~/lib/utils";
import type { Role, User } from "~/types";
import { useAuthStore } from "~/store/authStore";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { EmptyState } from "~/components/empty-state";
import { UserFormDialog } from "~/components/users/UserFormDialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{ open: boolean; user?: User }>({ open: false });
  const currentUser = useAuthStore((s) => s.user);

  async function load() {
    setIsLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([usersApi.list(), rolesApi.list()]);
      setUsers(unwrapList(usersRes.data));
      setRoles(unwrapList(rolesRes.data));
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudieron cargar los usuarios."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(user: User) {
    if (user.id === currentUser?.id) {
      toast.error("No puedes eliminar tu propio usuario.");
      return;
    }
    if (!confirm(`Eliminar a ${user.first_name} ${user.last_name}?`)) return;
    try {
      await usersApi.remove(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success("Usuario eliminado.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo eliminar el usuario."));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">Usuarios</h1>
          <p className="text-sm text-muted">Administra cuentas y roles del equipo.</p>
        </div>
        <Button variant="primary" onClick={() => setDialogState({ open: true })}>
          <Plus className="size-4" />
          Nuevo usuario
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No hay usuarios registrados" />
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Correo</th>
                <th className="px-4 py-3 font-medium">Roles</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-4 py-3 text-ink-800">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length === 0 ? (
                        <span className="text-xs text-muted">Sin rol</span>
                      ) : (
                        user.roles.map((role) => (
                          <Badge key={role.id} variant="signal">
                            {role.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.is_active ? "grass" : "neutral"}>
                      {user.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setDialogState({ open: true, user })}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
                        <Trash2 className="size-4 text-flag-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserFormDialog
        open={dialogState.open}
        user={dialogState.user}
        roles={roles}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        onSaved={(saved) => {
          setUsers((prev) => {
            const exists = prev.some((u) => u.id === saved.id);
            return exists ? prev.map((u) => (u.id === saved.id ? saved : u)) : [...prev, saved];
          });
        }}
      />
    </div>
  );
}
