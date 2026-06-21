import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useSchedules } from "../hooks/useSchedules";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
import ScheduleTable from "../components/organisms/ScheduleTable";
import ConfirmDialog from "../components/molecules/ConfirmDialog";
import PageHeader from "../components/molecules/PageHeader";
import Button from "../components/atoms/Button";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";
import { ROLE_NAMES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

export default function SchedulesPage() {
  const { schedules, isLoading, error, removeSchedule, updateOperationalStatus } = useSchedules();
  const { users } = useUsers();
  const { user, userHasAnyRole } = useAuth();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const canManage = userHasAnyRole([ROLE_NAMES.ADMIN, ROLE_NAMES.COORDINATOR]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await removeSchedule(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Agendas"
        description="Administra las agendas asignadas al equipo."
        action={
          canManage && (
            <Link to={ROUTES.SCHEDULE_NEW}>
              <Button>
                <Plus className="h-4 w-4" />
                Nueva agenda
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
      {error && <Alert tone="error">No fue posible cargar las agendas.</Alert>}
      {!isLoading && !error && (
        <ScheduleTable
          schedules={schedules}
          users={users}
          currentUserId={user?.id}
          canManage={canManage}
          onDelete={setPendingDeleteId}
          onUpdateOperationalStatus={updateOperationalStatus}
        />
      )}
      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Eliminar agenda"
        description="Esta accion no se puede deshacer."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
