import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";
import { permissionsApi } from "../api/permissionsApi";
import PermissionManager from "../components/organisms/PermissionManager";
import PageHeader from "../components/molecules/PageHeader";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";
import { ROLE_NAMES } from "../constants/roles";
import { extractErrorMessage } from "../utils/apiError";

export default function PermissionsPage() {
  const { permissions, isLoading, error, refetch, removePermission } = usePermissions();
  const { userHasAnyRole } = useAuth();
  const canManage = userHasAnyRole([ROLE_NAMES.ADMIN]);

  const handleCreate = async (values) => {
    try {
      await permissionsApi.create(values);
      await refetch();
    } catch (apiError) {
      throw new Error(extractErrorMessage(apiError));
    }
  };

  return (
    <div>
      <PageHeader title="Permisos" description="Define los permisos que se pueden asignar a un rol." />
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {error && <Alert tone="error">No fue posible cargar los permisos.</Alert>}
      {!isLoading && !error && (
        <PermissionManager
          permissions={permissions}
          canManage={canManage}
          onCreate={handleCreate}
          onDelete={removePermission}
        />
      )}
    </div>
  );
}
