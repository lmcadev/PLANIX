import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/atoms/Card";
import Spinner from "../components/atoms/Spinner";
import ScheduleForm from "../components/organisms/ScheduleForm";
import PageHeader from "../components/molecules/PageHeader";
import { useUsers } from "../hooks/useUsers";
import { schedulesApi } from "../api/schedulesApi";
import { extractErrorMessage, extractFieldErrors } from "../utils/apiError";
import { ROUTES } from "../constants/routes";

export default function ScheduleFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { users, isLoading: isLoadingUsers } = useUsers();
  const [schedule, setSchedule] = useState(null);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!isEditing) return;
    schedulesApi.getById(id).then((response) => {
      setSchedule(response.data);
      setIsLoadingSchedule(false);
    });
  }, [id, isEditing]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setFieldErrors({});
    try {
      if (isEditing) {
        await schedulesApi.update(id, payload);
      } else {
        await schedulesApi.create(payload);
      }
      navigate(ROUTES.SCHEDULES);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error));
      setFieldErrors(extractFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingUsers || isLoadingSchedule;

  return (
    <div>
      <PageHeader title={isEditing ? "Editar agenda" : "Nueva agenda"} />
      <Card className="max-w-3xl">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <ScheduleForm
            schedule={schedule}
            users={users}
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
