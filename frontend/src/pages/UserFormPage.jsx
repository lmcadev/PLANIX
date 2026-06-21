import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/atoms/Card";
import Spinner from "../components/atoms/Spinner";
import UserForm from "../components/organisms/UserForm";
import PageHeader from "../components/molecules/PageHeader";
import { useRoles } from "../hooks/useRoles";
import { usersApi } from "../api/usersApi";
import { extractErrorMessage, extractFieldErrors } from "../utils/apiError";
import { ROUTES } from "../constants/routes";

export default function UserFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { roles, isLoading: isLoadingRoles } = useRoles();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    usersApi.getById(id).then((response) => {
      setUser(response.data);
      setIsLoadingUser(false);
    });
  }, [id, isEditing]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});
    try {
      if (isEditing) {
        await usersApi.update(id, payload);
      } else {
        await usersApi.create(payload);
      }
      navigate(ROUTES.USERS);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setFieldErrors(extractFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingRoles || isLoadingUser;

  return (
    <div>
      <PageHeader title={isEditing ? "Editar usuario" : "Nuevo usuario"} />
      <Card className="max-w-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <UserForm
            user={user}
            roles={roles}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            fieldErrors={fieldErrors}
          />
        )}
      </Card>
    </div>
  );
}
