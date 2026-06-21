import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { rolesApi, type RolePayload } from "~/api/roles";
import { extractErrorMessage } from "~/lib/apiClient";
import type { Permission, Role } from "~/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

interface RoleFormDialogProps {
  open: boolean;
  role?: Role;
  permissions: Permission[];
  onOpenChange: (open: boolean) => void;
  onSaved: (role: Role) => void;
}

const emptyForm = { name: "", description: "", permission_ids: [] as number[] };

export function RoleFormDialog({ open, role, permissions, onOpenChange, onSaved }: RoleFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      role
        ? {
            name: role.name,
            description: role.description,
            permission_ids: role.permissions.map((p) => p.id),
          }
        : emptyForm,
    );
  }, [open, role]);

  function togglePermission(id: number) {
    setForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(id)
        ? prev.permission_ids.filter((p) => p !== id)
        : [...prev.permission_ids, id],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: RolePayload = {
      name: form.name,
      description: form.description,
      permission_ids: form.permission_ids,
    };

    try {
      const { data } = role ? await rolesApi.update(role.id, payload) : await rolesApi.create(payload);
      onSaved(data);
      toast.success(role ? "Rol actualizado." : "Rol creado.");
      onOpenChange(false);
    } catch (err) {
      setError(extractErrorMessage(err, "Revisa los datos del formulario."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? "Editar rol" : "Nuevo rol"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nombre" htmlFor="name">
            <Input id="name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </Field>

          <Field label="Descripcion" htmlFor="description">
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </Field>

          <Field label="Permisos" htmlFor="permissions">
            <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border border-line p-3">
              {permissions.length === 0 ? (
                <p className="col-span-2 text-xs text-muted">No hay permisos registrados todavia.</p>
              ) : (
                permissions.map((permission) => {
                  const checked = form.permission_ids.includes(permission.id);
                  return (
                    <label key={permission.id} className="flex items-center gap-2 text-sm text-ink-800">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-line-strong text-signal-600 focus:ring-signal-100"
                        checked={checked}
                        onChange={() => togglePermission(permission.id)}
                      />
                      <span className="font-mono-data text-xs">{permission.code}</span>
                    </label>
                  );
                })
              )}
            </div>
          </Field>

          {error ? <p className="text-sm font-medium text-flag-600">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
