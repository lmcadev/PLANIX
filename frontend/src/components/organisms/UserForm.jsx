import { useState } from "react";
import { Save } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Checkbox from "../atoms/Checkbox";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";

const buildInitialValues = (user) => ({
  first_name: user?.first_name ?? "",
  last_name: user?.last_name ?? "",
  email: user?.email ?? "",
  password: "",
  is_active: user?.is_active ?? true,
});

export default function UserForm({ user, roles, onSubmit, isSubmitting, errorMessage, fieldErrors = {} }) {
  const isEditing = Boolean(user);
  const [values, setValues] = useState(buildInitialValues(user));
  const [roleIds, setRoleIds] = useState(user?.roles?.map((role) => role.id) ?? []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleRole = (roleId) => {
    setRoleIds((current) =>
      current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = { ...values, role_ids: roleIds };
    if (!payload.password) delete payload.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Alert tone="error">{errorMessage}</Alert>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" htmlFor="first_name" required error={fieldErrors.first_name}>
          <Input id="first_name" name="first_name" value={values.first_name} onChange={handleChange} required />
        </FormField>
        <FormField label="Apellido" htmlFor="last_name" required error={fieldErrors.last_name}>
          <Input id="last_name" name="last_name" value={values.last_name} onChange={handleChange} required />
        </FormField>
      </div>
      <FormField label="Correo electronico" htmlFor="email" required error={fieldErrors.email}>
        <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} required />
      </FormField>
      <FormField
        label={isEditing ? "Nueva contrasena (opcional)" : "Contrasena"}
        htmlFor="password"
        required={!isEditing}
        error={fieldErrors.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          value={values.password}
          onChange={handleChange}
          required={!isEditing}
        />
      </FormField>
      <Checkbox label="Usuario activo" name="is_active" checked={values.is_active} onChange={handleChange} />
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Roles</p>
        <div className="flex flex-wrap gap-4">
          {roles.map((role) => (
            <Checkbox
              key={role.id}
              label={role.name}
              checked={roleIds.includes(role.id)}
              onChange={() => toggleRole(role.id)}
            />
          ))}
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
        <Save className="h-4 w-4" />
        Guardar usuario
      </Button>
    </form>
  );
}
