import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { schedulesApi } from "~/api/schedules";
import { extractErrorMessage } from "~/lib/apiClient";
import { datetimeLocalToIso, isoToDatetimeLocal } from "~/lib/date";
import type { RecurrenceType, Schedule, SchedulePayload, ScheduleStatus, User } from "~/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface ScheduleFormDialogProps {
  open: boolean;
  schedule?: Schedule;
  users: User[];
  onOpenChange: (open: boolean) => void;
  onSaved: (schedule: Schedule) => void;
}

const emptyForm = {
  title: "",
  description: "",
  assigned_user: "",
  start_datetime: "",
  end_datetime: "",
  location: "",
  meeting_link: "",
  status: "busy" as ScheduleStatus,
  is_recurring: false,
  recurrence_type: "none" as RecurrenceType,
  recurrence_interval: 1,
  recurrence_end_date: "",
};

export function ScheduleFormDialog({ open, schedule, users, onOpenChange, onSaved }: ScheduleFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (schedule) {
      setForm({
        title: schedule.title,
        description: schedule.description,
        assigned_user: String(schedule.assigned_user),
        start_datetime: isoToDatetimeLocal(schedule.start_datetime),
        end_datetime: isoToDatetimeLocal(schedule.end_datetime),
        location: schedule.location,
        meeting_link: schedule.meeting_link,
        status: schedule.status,
        is_recurring: schedule.is_recurring,
        recurrence_type: schedule.recurrence_type,
        recurrence_interval: schedule.recurrence_interval,
        recurrence_end_date: schedule.recurrence_end_date ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, schedule]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: SchedulePayload = {
      title: form.title,
      description: form.description,
      assigned_user: Number(form.assigned_user),
      start_datetime: datetimeLocalToIso(form.start_datetime),
      end_datetime: datetimeLocalToIso(form.end_datetime),
      location: form.location,
      meeting_link: form.meeting_link,
      status: form.status,
      is_recurring: form.is_recurring,
      recurrence_type: form.recurrence_type,
      recurrence_interval: form.recurrence_interval,
      recurrence_end_date: form.recurrence_end_date || null,
    };

    try {
      const { data } = schedule
        ? await schedulesApi.update(schedule.id, payload)
        : await schedulesApi.create(payload);
      onSaved(data);
      toast.success(schedule ? "Agenda actualizada." : "Agenda creada.");
      onOpenChange(false);
    } catch (err) {
      setError(extractErrorMessage(err, "Revisa los datos del formulario."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{schedule ? "Editar agenda" : "Nueva agenda"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Titulo" htmlFor="title">
            <Input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
          </Field>

          <Field label="Descripcion" htmlFor="description">
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>

          <Field label="Asignado a" htmlFor="assigned_user">
            <Select value={form.assigned_user} onValueChange={(value) => update("assigned_user", value)}>
              <SelectTrigger id="assigned_user">
                <SelectValue placeholder="Selecciona un ingeniero" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.first_name} {u.last_name} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Inicio" htmlFor="start_datetime">
              <Input
                id="start_datetime"
                type="datetime-local"
                required
                value={form.start_datetime}
                onChange={(e) => update("start_datetime", e.target.value)}
              />
            </Field>
            <Field label="Fin" htmlFor="end_datetime">
              <Input
                id="end_datetime"
                type="datetime-local"
                required
                value={form.end_datetime}
                onChange={(e) => update("end_datetime", e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Ubicacion" htmlFor="location">
              <Input id="location" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </Field>
            <Field label="Enlace de reunion" htmlFor="meeting_link">
              <Input
                id="meeting_link"
                type="url"
                placeholder="https://..."
                value={form.meeting_link}
                onChange={(e) => update("meeting_link", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Estado" htmlFor="status">
            <Select value={form.status} onValueChange={(value) => update("status", value as ScheduleStatus)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="busy">Ocupado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="completed">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Recurrencia" htmlFor="recurrence_type">
              <Select
                value={form.recurrence_type}
                onValueChange={(value) => update("recurrence_type", value as RecurrenceType)}
              >
                <SelectTrigger id="recurrence_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin recurrencia</SelectItem>
                  <SelectItem value="daily">Diaria</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Repetir hasta" htmlFor="recurrence_end_date">
              <Input
                id="recurrence_end_date"
                type="date"
                disabled={form.recurrence_type === "none"}
                value={form.recurrence_end_date}
                onChange={(e) => update("recurrence_end_date", e.target.value)}
              />
            </Field>
          </div>

          {error ? <p className="text-sm font-medium text-flag-600">{error}</p> : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
