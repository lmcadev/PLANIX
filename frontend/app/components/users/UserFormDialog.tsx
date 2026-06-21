import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { usersApi } from "~/api/users";
import { extractErrorMessage } from "~/lib/apiClient";
import type { Role, User, UserPayload } from "~/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface UserFormDialogProps {
  open: boolean;
  user?: User;
  roles: Role[];
  onOpenChange: (open: boolean) => void;
  onSaved: (user: User) => void;
}

const emptyForm = { first_name: "", last_name: "", email: "", password: "", role_ids: [] as number[] };

export function UserFormDialog({ open, user, roles, onOpenChange, onSaved }: UserFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      user
        ? {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: "",
            role_ids: user.roles.map((r) => r.id),
          }
        : emptyForm,
    );
  }, [open, user]);

  function toggleRole(roleId: number) {
    setForm((prev) => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter((id) => id !== roleId)
        : [...prev.role_ids, roleId],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: UserPayload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      role_ids: form.role_ids,
    };
    if (form.password) payload.password = form.password;

    try {
      const { data } = user
        ? await usersApi.update(user.id, payload)
        : await usersApi.create(payload);
      onSaved(data);
      toast.success(user ? "Usuario actualizado." : "Usuario creado.");
      onOpenChange(false);
    } catch (err) {
      setError(extractErrorMessage(err, "Revisa los datos del formulario."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="first_name">
              <Input
                id="first_name"
                required
                value={form.first_name}
                onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
              />
            </Field>
            <Field label="Apellido" htmlFor="last_name">
              <Input
                id="last_name"
                required
                value={form.last_name}
                onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
              />
            </Field>
          </div>

          <Field label="Correo electronico" htmlFor="email">
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </Field>

          <Field
            label={user ? "Nueva contrasena (opcional)" : "Contrasena"}
            htmlFor="password"
          >
            <Input
              id="password"
              type="password"
              minLength={8}
              required={!user}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            />
          </Field>

          <Field label="Roles" htmlFor="roles">
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => {
                const checked = form.role_ids.includes(role.id);
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => toggleRole(role.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      checked
                        ? "border-signal-500 bg-signal-50 text-signal-700"
                        : "border-line-strong bg-surface text-ink-700 hover:bg-paper"
                    }`}
                  >
                    {role.name}
                  </button>
                );
              })}
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
