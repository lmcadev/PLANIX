import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
import UserTable from "../components/organisms/UserTable";
import ConfirmDialog from "../components/molecules/ConfirmDialog";
import PageHeader from "../components/molecules/PageHeader";
import Button from "../components/atoms/Button";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";
import { ROLE_NAMES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

export default function UsersPage() {
  const { users, isLoading, error, removeUser } = useUsers();
  const { userHasAnyRole } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = userHasAnyRole([ROLE_NAMES.ADMIN]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await removeUser(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Gestiona las cuentas y roles del equipo."
        action={
          canManage && (
            <Link to={ROUTES.USER_NEW}>
              <Button>
                <Plus className="h-4 w-4" />
                Nuevo usuario
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
      {error && <Alert tone="error">No fue posible cargar los usuarios.</Alert>}
      {!isLoading && !error && (
        <UserTable users={users} canManage={canManage} onDelete={setPendingDeleteId} />
      )}
      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Eliminar usuario"
        description="Esta accion no se puede deshacer."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
