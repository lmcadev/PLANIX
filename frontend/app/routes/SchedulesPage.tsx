import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";
import { schedulesApi } from "~/api/schedules";
import { usersApi } from "~/api/users";
import { extractErrorMessage } from "~/lib/apiClient";
import { unwrapList } from "~/lib/utils";
import { formatDateTime } from "~/lib/date";
import {
  OPERATIONAL_STATUS_LABEL,
  OPERATIONAL_STATUS_VARIANT,
  SCHEDULE_STATUS_LABEL,
  SCHEDULE_STATUS_VARIANT,
} from "~/lib/status";
import type { OperationalStatus, Schedule, User } from "~/types";
import { useAuthStore } from "~/store/authStore";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { EmptyState } from "~/components/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ScheduleFormDialog } from "~/components/schedules/ScheduleFormDialog";
import { toast } from "sonner";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogState, setDialogState] = useState<{ open: boolean; schedule?: Schedule }>({ open: false });

  const currentUser = useAuthStore((s) => s.user);
  const hasRole = useAuthStore((s) => s.hasRole);
  const canManage = hasRole("admin", "coordinator");

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  async function load() {
    setIsLoading(true);
    try {
      const [schedulesRes, usersRes] = await Promise.all([schedulesApi.list(), usersApi.list()]);
      setSchedules(unwrapList(schedulesRes.data));
      setUsers(unwrapList(usersRes.data));
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudieron cargar las agendas."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(schedule: Schedule) {
    if (!confirm(`Eliminar la agenda "${schedule.title}"?`)) return;
    try {
      await schedulesApi.remove(schedule.id);
      setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
      toast.success("Agenda eliminada.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo eliminar la agenda."));
    }
  }

  async function handleOperationalStatusChange(schedule: Schedule, value: OperationalStatus) {
    try {
      const { data } = await schedulesApi.setOperationalStatus(schedule.id, value);
      setSchedules((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } catch (err) {
      toast.error(extractErrorMessage(err, "No se pudo actualizar el estado operativo."));
    }
  }

  function canEditOperationalStatus(schedule: Schedule) {
    return canManage || schedule.assigned_user === currentUser?.id;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-900">Agendas</h1>
          <p className="text-sm text-muted">Planificacion y seguimiento de actividades del equipo.</p>
        </div>
        {canManage ? (
          <Button variant="primary" onClick={() => setDialogState({ open: true })}>
            <Plus className="size-4" />
            Nueva agenda
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : schedules.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No hay agendas registradas"
          description="Crea la primera agenda para empezar a planificar al equipo."
          action={
            canManage ? (
              <Button variant="primary" size="sm" onClick={() => setDialogState({ open: true })}>
                <Plus className="size-4" />
                Nueva agenda
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Agenda</th>
                <th className="px-4 py-3 font-medium">Asignado a</th>
                <th className="px-4 py-3 font-medium">Inicio</th>
                <th className="px-4 py-3 font-medium">Fin</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Estado operativo</th>
                {canManage ? <th className="px-4 py-3 font-medium" /> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-paper/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{schedule.title}</p>
                    {schedule.location ? <p className="text-xs text-muted">{schedule.location}</p> : null}
                  </td>
                  <td className="px-4 py-3 text-ink-800">
                    {usersById.get(schedule.assigned_user)?.email ?? `#${schedule.assigned_user}`}
                  </td>
                  <td className="px-4 py-3 font-mono-data text-xs text-ink-800">
                    {formatDateTime(schedule.start_datetime)}
                  </td>
                  <td className="px-4 py-3 font-mono-data text-xs text-ink-800">
                    {formatDateTime(schedule.end_datetime)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={SCHEDULE_STATUS_VARIANT[schedule.status]}>
                      {SCHEDULE_STATUS_LABEL[schedule.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {canEditOperationalStatus(schedule) ? (
                      <Select
                        value={schedule.operational_status}
                        onValueChange={(value) => handleOperationalStatusChange(schedule, value as OperationalStatus)}
                      >
                        <SelectTrigger className="h-8 w-40 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OPERATIONAL_STATUS_LABEL).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={OPERATIONAL_STATUS_VARIANT[schedule.operational_status]}>
                        {OPERATIONAL_STATUS_LABEL[schedule.operational_status]}
                      </Badge>
                    )}
                  </td>
                  {canManage ? (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDialogState({ open: true, schedule })}
                          aria-label="Editar agenda"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(schedule)}
                          aria-label="Eliminar agenda"
                        >
                          <Trash2 className="size-4 text-flag-600" />
                        </Button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ScheduleFormDialog
        open={dialogState.open}
        schedule={dialogState.schedule}
        users={users}
        onOpenChange={(open) => setDialogState((prev) => ({ ...prev, open }))}
        onSaved={(saved) => {
          setSchedules((prev) => {
            const exists = prev.some((s) => s.id === saved.id);
            return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
          });
        }}
      />
    </div>
  );
}
