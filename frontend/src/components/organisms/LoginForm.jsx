import { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";

export default function LoginForm({ onSubmit, isSubmitting, errorMessage }) {
  const [values, setValues] = useState({ email: "", password: "" });

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
      <FormField label="Correo electronico" htmlFor="email" required>
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
      <FormField label="Contrasena" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          icon={Lock}
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          required
        />
      </FormField>
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        <LogIn className="h-4 w-4" />
        Iniciar sesion
      </Button>
    </form>
  );
}
