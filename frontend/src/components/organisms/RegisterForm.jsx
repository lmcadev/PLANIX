import { useState } from "react";
import { Lock, Mail, UserPlus } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";

const INITIAL_VALUES = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

export default function RegisterForm({ onSubmit, isSubmitting, errorMessage, fieldErrors = {} }) {
  const [values, setValues] = useState(INITIAL_VALUES);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Alert tone="error">{errorMessage}</Alert>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" htmlFor="first_name" required error={fieldErrors.first_name}>
          <Input
            id="first_name"
            name="first_name"
            value={values.first_name}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Apellido" htmlFor="last_name" required error={fieldErrors.last_name}>
          <Input
            id="last_name"
            name="last_name"
            value={values.last_name}
            onChange={handleChange}
            required
          />
        </FormField>
      </div>
      <FormField label="Correo electronico" htmlFor="email" required error={fieldErrors.email}>
        <Input
          id="email"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          required
        />
      </FormField>
      <FormField label="Contrasena" htmlFor="password" required error={fieldErrors.password}>
        <Input
          id="password"
          name="password"
          type="password"
          icon={Lock}
          autoComplete="new-password"
          minLength={8}
          value={values.password}
          onChange={handleChange}
          required
        />
      </FormField>
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        <UserPlus className="h-4 w-4" />
        Crear cuenta
      </Button>
    </form>
  );
}
