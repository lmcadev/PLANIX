import { useState } from "react";
import { Save } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";
import Checkbox from "../atoms/Checkbox";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";

export default function RoleForm({ role, permissions, onSubmit, isSubmitting, errorMessage, fieldErrors = {} }) {
  const [values, setValues] = useState({
    name: role?.name ?? "",
    description: role?.description ?? "",
  });
  const [permissionIds, setPermissionIds] = useState(
    role?.permissions?.map((permission) => permission.id) ?? [],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const togglePermission = (permissionId) => {
    setPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ ...values, permission_ids: permissionIds });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Alert tone="error">{errorMessage}</Alert>
      <FormField label="Nombre" htmlFor="name" required error={fieldErrors.name}>
        <Input id="name" name="name" value={values.name} onChange={handleChange} required />
      </FormField>
      <FormField label="Descripcion" htmlFor="description" error={fieldErrors.description}>
        <Textarea id="description" name="description" value={values.description} onChange={handleChange} />
      </FormField>
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Permisos</p>
        <div className="flex flex-wrap gap-4">
          {permissions.map((permission) => (
            <Checkbox
              key={permission.id}
              label={permission.code}
              checked={permissionIds.includes(permission.id)}
              onChange={() => togglePermission(permission.id)}
            />
          ))}
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
        <Save className="h-4 w-4" />
        Guardar rol
      </Button>
    </form>
  );
}
