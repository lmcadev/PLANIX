import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/atoms/Card";
import Spinner from "../components/atoms/Spinner";
import RoleForm from "../components/organisms/RoleForm";
import PageHeader from "../components/molecules/PageHeader";
import { usePermissions } from "../hooks/usePermissions";
import { rolesApi } from "../api/rolesApi";
import { extractErrorMessage, extractFieldErrors } from "../utils/apiError";
import { ROUTES } from "../constants/routes";

export default function RoleFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { permissions, isLoading: isLoadingPermissions } = usePermissions();
  const [role, setRole] = useState(null);
  const [isLoadingRole, setIsLoadingRole] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    rolesApi.getById(id).then((response) => {
      setRole(response.data);
      setIsLoadingRole(false);
    });
  }, [id, isEditing]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});
    try {
      if (isEditing) {
        await rolesApi.update(id, payload);
      } else {
        await rolesApi.create(payload);
      }
      navigate(ROUTES.ROLES);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setFieldErrors(extractFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingPermissions || isLoadingRole;

  return (
    <div>
      <PageHeader title={isEditing ? "Editar rol" : "Nuevo rol"} />
      <Card className="max-w-2xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <RoleForm
            role={role}
            permissions={permissions}
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
