import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import Select from "../atoms/Select";
import ScheduleStatusBadge from "../molecules/ScheduleStatusBadge";
import OperationalStatusBadge from "../molecules/OperationalStatusBadge";
import EmptyState from "../molecules/EmptyState";
import { OPERATIONAL_STATUS_OPTIONS } from "../../constants/schedules";
import { formatDateTime } from "../../utils/formatDate";
import { buildRoute, ROUTES } from "../../constants/routes";

export default function ScheduleTable({
  schedules,
  users,
  currentUserId,
  canManage,
  onDelete,
  onUpdateOperationalStatus,
}) {
  if (schedules.length === 0) {
    return <EmptyState title="No hay agendas registradas" description="Crea una nueva agenda para comenzar." />;
  }

  const userById = users.reduce((accumulator, user) => {
    accumulator[user.id] = user;
    return accumulator;
  }, {});

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-card">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3.5">Titulo</th>
            <th className="px-5 py-3.5">Asignado a</th>
            <th className="px-5 py-3.5">Inicio</th>
            <th className="px-5 py-3.5">Fin</th>
            <th className="px-5 py-3.5">Estado</th>
            <th className="px-5 py-3.5">Estado operativo</th>
            <th className="px-5 py-3.5">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {schedules.map((schedule) => {
            const canUpdateOperationalStatus = canManage || schedule.assigned_user === currentUserId;
            const assignedUser = userById[schedule.assigned_user];
            return (
              <tr key={schedule.id} className="transition-colors hover:bg-slate-50/60">
                <td className="px-5 py-3.5 font-medium text-slate-900">{schedule.title}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      firstName={assignedUser?.first_name}
                      lastName={assignedUser?.last_name}
                      size={28}
                    />
                    {assignedUser ? `${assignedUser.first_name} ${assignedUser.last_name}` : schedule.assigned_user}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{formatDateTime(schedule.start_datetime)}</td>
                <td className="px-5 py-3.5 text-slate-600">{formatDateTime(schedule.end_datetime)}</td>
                <td className="px-5 py-3.5">
                  <ScheduleStatusBadge status={schedule.status} />
                </td>
                <td className="px-5 py-3.5">
                  {canUpdateOperationalStatus ? (
                    <Select
                      options={OPERATIONAL_STATUS_OPTIONS}
                      value={schedule.operational_status}
                      onChange={(event) => onUpdateOperationalStatus(schedule.id, event.target.value)}
                      className="min-w-[150px]"
                    />
                  ) : (
                    <OperationalStatusBadge status={schedule.operational_status} />
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {canManage && (
                    <div className="flex gap-2">
                      <Link to={buildRoute(ROUTES.SCHEDULE_EDIT, { id: schedule.id })}>
                        <Button variant="secondary" size="sm">
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={() => onDelete(schedule.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Eliminar
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
