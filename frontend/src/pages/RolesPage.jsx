import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useRoles } from "../hooks/useRoles";
import { useAuth } from "../hooks/useAuth";
import RoleTable from "../components/organisms/RoleTable";
import ConfirmDialog from "../components/molecules/ConfirmDialog";
import PageHeader from "../components/molecules/PageHeader";
import Button from "../components/atoms/Button";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";
import { ROLE_NAMES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

export default function RolesPage() {
  const { roles, isLoading, error, removeRole } = useRoles();
  const { userHasAnyRole } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = userHasAnyRole([ROLE_NAMES.ADMIN]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await removeRole(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Define los roles disponibles y sus permisos."
        action={
          canManage && (
            <Link to={ROUTES.ROLE_NEW}>
              <Button>
                <Plus className="h-4 w-4" />
                Nuevo rol
              </Button>
            </Link>
          )
        }
      />
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {error && <Alert tone="error">No fue posible cargar los roles.</Alert>}
      {!isLoading && !error && (
        <RoleTable roles={roles} canManage={canManage} onDelete={setPendingDeleteId} />
      )}
      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Eliminar rol"
        description="Esta accion no se puede deshacer."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
