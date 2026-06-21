import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { authApi } from "~/api/auth";
import { extractErrorMessage } from "~/lib/apiClient";
import { useAuthStore } from "~/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.register(form);
      const { data } = await authApi.login({ email: form.email, password: form.password });
      setTokens(data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo crear la cuenta."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crea tu cuenta</CardTitle>
        <CardDescription>Empieza a planificar las agendas de tu equipo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" htmlFor="first_name">
              <Input
                id="first_name"
                required
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
              />
            </Field>
            <Field label="Apellido" htmlFor="last_name">
              <Input
                id="last_name"
                required
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Correo electronico" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Contrasena" htmlFor="password">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
            />
          </Field>

          {error ? <p className="text-sm font-medium text-flag-600">{error}</p> : null}

          <Button type="submit" variant="primary" disabled={isSubmitting} className="mt-1">
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Ya tienes cuenta?{" "}
          <Link to="/login" className="font-medium text-signal-600 hover:underline">
            Inicia sesion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
