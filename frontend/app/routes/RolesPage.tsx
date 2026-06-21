import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { rolesApi, permissionsApi } from "~/api/roles";
import { extractErrorMessage } from "~/lib/apiClient";
import { unwrapList } from "~/lib/utils";
import type { Permission, Role } from "~/types";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { EmptyState } from "~/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { RoleFormDialog } from "~/components/roles/RoleFormDialog";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{ open: boolean; role?: Role }>({ open: false });

  async function load() {
    setIsLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([rolesApi.list(), permissionsApi.list()]);
      setRoles(unwrapList(rolesRes.data));
      setPermissions(unwrapList(permissionsRes.data));
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudieron cargar los roles."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(role: Role) {
    if (!confirm(`Eliminar el rol "${role.name}"?`)) return;
    try {
      await rolesApi.remove(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
      toast.success("Rol eliminado.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo eliminar el rol."));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">Roles y permisos</h1>
          <p className="text-sm text-muted">Define que puede hacer cada rol dentro de PLANIX.</p>
        </div>
        <Button variant="primary" onClick={() => setDialogState({ open: true })}>
          <Plus className="size-4" />
          Nuevo rol
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : roles.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No hay roles creados" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle>{role.name}</CardTitle>
                  {role.description ? <p className="mt-1 text-sm text-muted">{role.description}</p> : null}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setDialogState({ open: true, role })}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(role)}>
                    <Trash2 className="size-4 text-flag-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.length === 0 ? (
                    <span className="text-xs text-muted">Sin permisos asignados</span>
                  ) : (
                    role.permissions.map((permission) => (
                      <Badge key={permission.id} variant="neutral">
                        {permission.code}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RoleFormDialog
        open={dialogState.open}
        role={dialogState.role}
        permissions={permissions}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        onSaved={(saved) => {
          setRoles((prev) => {
            const exists = prev.some((r) => r.id === saved.id);
            return exists ? prev.map((r) => (r.id === saved.id ? saved : r)) : [...prev, saved];
          });
        }}
      />
    </div>
  );
}
