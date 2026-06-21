import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Textarea from "../atoms/Textarea";
import Checkbox from "../atoms/Checkbox";
import Alert from "../atoms/Alert";
import FormField from "../molecules/FormField";
import {
  SCHEDULE_STATUS_OPTIONS,
  OPERATIONAL_STATUS_OPTIONS,
  RECURRENCE_TYPE_OPTIONS,
} from "../../constants/schedules";
import { toDateTimeInputValue } from "../../utils/formatDate";

const buildInitialValues = (schedule) => ({
  title: schedule?.title ?? "",
  description: schedule?.description ?? "",
  assigned_user: schedule?.assigned_user ?? "",
  start_datetime: toDateTimeInputValue(schedule?.start_datetime),
  end_datetime: toDateTimeInputValue(schedule?.end_datetime),
  location: schedule?.location ?? "",
  meeting_link: schedule?.meeting_link ?? "",
  status: schedule?.status ?? "busy",
  operational_status: schedule?.operational_status ?? "waiting",
  is_recurring: schedule?.is_recurring ?? false,
  recurrence_type: schedule?.recurrence_type ?? "none",
  recurrence_interval: schedule?.recurrence_interval ?? 1,
  recurrence_end_date: schedule?.recurrence_end_date ?? "",
});

export default function ScheduleForm({
  schedule,
  users,
  onSubmit,
  isSubmitting,
  errorMessage,
  fieldErrors = {},
}) {
  const [values, setValues] = useState(buildInitialValues(schedule));
  const [exceptionDates, setExceptionDates] = useState(
    schedule?.exception_dates?.map((item) => item.exception_date) ?? [],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddExceptionDate = () => setExceptionDates((current) => [...current, ""]);

  const handleExceptionDateChange = (index, value) => {
    setExceptionDates((current) => current.map((date, i) => (i === index ? value : date)));
  };

  const handleRemoveExceptionDate = (index) => {
    setExceptionDates((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      assigned_user: Number(values.assigned_user),
      recurrence_interval: Number(values.recurrence_interval) || 1,
      start_datetime: `${values.start_datetime}:00`,
      end_datetime: `${values.end_datetime}:00`,
      recurrence_end_date: values.is_recurring ? values.recurrence_end_date || null : null,
      exception_dates: exceptionDates
        .filter((date) => date)
        .map((date) => ({ exception_date: date })),
    });
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name} (${user.email})`,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Alert tone="error">{errorMessage}</Alert>
      <FormField label="Titulo" htmlFor="title" required error={fieldErrors.title}>
        <Input id="title" name="title" value={values.title} onChange={handleChange} required />
      </FormField>
      <FormField label="Descripcion" htmlFor="description" error={fieldErrors.description}>
        <Textarea id="description" name="description" value={values.description} onChange={handleChange} />
      </FormField>
      <FormField
        label="Usuario asignado"
        htmlFor="assigned_user"
        required
        error={fieldErrors.assigned_user}
      >
        <Select
          id="assigned_user"
          name="assigned_user"
          placeholder="Selecciona un usuario"
          options={userOptions}
          value={values.assigned_user}
          onChange={handleChange}
          required
        />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Inicio"
          htmlFor="start_datetime"
          required
          error={fieldErrors.start_datetime}
        >
          <Input
            id="start_datetime"
            name="start_datetime"
            type="datetime-local"
            value={values.start_datetime}
            onChange={handleChange}
            required
          />
        </FormField>
        <FormField label="Fin" htmlFor="end_datetime" required error={fieldErrors.end_datetime}>
          <Input
            id="end_datetime"
            name="end_datetime"
            type="datetime-local"
            value={values.end_datetime}
            onChange={handleChange}
            required
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ubicacion" htmlFor="location" error={fieldErrors.location}>
          <Input id="location" name="location" value={values.location} onChange={handleChange} />
        </FormField>
        <FormField label="Enlace de reunion" htmlFor="meeting_link" error={fieldErrors.meeting_link}>
          <Input
            id="meeting_link"
            name="meeting_link"
            type="url"
            value={values.meeting_link}
            onChange={handleChange}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Estado" htmlFor="status" error={fieldErrors.status}>
          <Select
            id="status"
            name="status"
            options={SCHEDULE_STATUS_OPTIONS}
            value={values.status}
            onChange={handleChange}
          />
        </FormField>
        <FormField
          label="Estado operativo"
          htmlFor="operational_status"
          error={fieldErrors.operational_status}
        >
          <Select
            id="operational_status"
            name="operational_status"
            options={OPERATIONAL_STATUS_OPTIONS}
            value={values.operational_status}
            onChange={handleChange}
          />
        </FormField>
      </div>
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <Checkbox
          label="Es recurrente"
          name="is_recurring"
          checked={values.is_recurring}
          onChange={handleChange}
        />
        {values.is_recurring && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <FormField label="Tipo de recurrencia" htmlFor="recurrence_type">
              <Select
                id="recurrence_type"
                name="recurrence_type"
                options={RECURRENCE_TYPE_OPTIONS}
                value={values.recurrence_type}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Intervalo" htmlFor="recurrence_interval">
              <Input
                id="recurrence_interval"
                name="recurrence_interval"
                type="number"
                min={1}
                value={values.recurrence_interval}
                onChange={handleChange}
              />
            </FormField>
            <FormField label="Fin de recurrencia" htmlFor="recurrence_end_date">
              <Input
                id="recurrence_end_date"
                name="recurrence_end_date"
                type="date"
                value={values.recurrence_end_date}
                onChange={handleChange}
              />
            </FormField>
          </div>
        )}
      </div>
      <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Fechas de excepcion</p>
        <div className="flex flex-col gap-2">
          {exceptionDates.map((date, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="date"
                value={date}
                onChange={(event) => handleExceptionDateChange(index, event.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveExceptionDate(index)}
                aria-label="Quitar fecha"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={handleAddExceptionDate} className="self-start">
            <Plus className="h-3.5 w-3.5" />
            Agregar fecha de excepcion
          </Button>
        </div>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
        <Save className="h-4 w-4" />
        Guardar agenda
      </Button>
    </form>
  );
}
