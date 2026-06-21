import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";
import EmptyState from "../molecules/EmptyState";

const INITIAL_VALUES = { name: "", code: "", description: "" };

export default function PermissionManager({ permissions, canManage, onCreate, onDelete }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await onCreate(values);
      setValues(INITIAL_VALUES);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {canManage && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 items-end gap-4 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card"
        >
          <FormField label="Nombre" htmlFor="name" required>
            <Input id="name" name="name" value={values.name} onChange={handleChange} required />
          </FormField>
          <FormField label="Codigo" htmlFor="code" required>
            <Input id="code" name="code" value={values.code} onChange={handleChange} required />
          </FormField>
          <FormField label="Descripcion" htmlFor="description">
            <Input id="description" name="description" value={values.description} onChange={handleChange} />
          </FormField>
          <Button type="submit" isLoading={isSubmitting}>
            <Plus className="h-4 w-4" />
            Crear permiso
          </Button>
          <div className="col-span-4">
            <Alert tone="error">{errorMessage}</Alert>
          </div>
        </form>
      )}
      {permissions.length === 0 ? (
        <EmptyState title="No hay permisos registrados" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-card">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Nombre</th>
                <th className="px-5 py-3.5">Codigo</th>
                <th className="px-5 py-3.5">Descripcion</th>
                {canManage && <th className="px-5 py-3.5">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissions.map((permission) => (
                <tr key={permission.id} className="transition-colors hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{permission.name}</td>
                  <td className="px-5 py-3.5 text-slate-600">{permission.code}</td>
                  <td className="px-5 py-3.5 text-slate-600">{permission.description}</td>
                  {canManage && (
                    <td className="px-5 py-3.5">
                      <Button variant="danger" size="sm" onClick={() => onDelete(permission.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
