import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/templates/AuthLayout";
import RegisterForm from "../components/organisms/RegisterForm";
import { useAuth } from "../hooks/useAuth";
import { extractErrorMessage, extractFieldErrors } from "../utils/apiError";
import { ROUTES } from "../constants/routes";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});
    try {
      await register(values);
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setFieldErrors(extractFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Gestion de agenda y tareas de ingenieros">
      <RegisterForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
      />
      <p className="mt-5 text-center text-sm text-slate-500">
        Ya tienes cuenta?{" "}
        <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:text-primary-700">
          Inicia sesion
        </Link>
      </p>
    </AuthLayout>
  );
}
