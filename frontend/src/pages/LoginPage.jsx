import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout";
import LoginForm from "../components/organisms/LoginForm";
import { useAuth } from "../hooks/useAuth";
import { extractErrorMessage } from "../utils/apiError";
import { ROUTES } from "../constants/routes";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await login(values);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Inicia sesion" subtitle="Gestion de agenda y tareas de ingenieros">
      <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />
      <p className="mt-5 text-center text-sm text-slate-500">
        No tienes cuenta?{" "}
        <Link to={ROUTES.REGISTER} className="font-semibold text-primary-600 hover:text-primary-700">
          Registrate
        </Link>
      </p>
    </AuthLayout>
  );
}
