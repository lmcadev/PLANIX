from rest_framework.exceptions import ValidationError

from .models import Schedule, ScheduleStatus


class ScheduleConflictService:
    @staticmethod
    def validate_time_range(start_datetime, end_datetime):
        if end_datetime <= start_datetime:
            raise ValidationError({"end_datetime": "La fecha y hora de fin debe ser mayor que la de inicio."})

    @staticmethod
    def validate_no_conflict(assigned_user, start_datetime, end_datetime, schedule_id=None):
        query = Schedule.objects.filter(
            assigned_user=assigned_user,
            start_datetime__lt=end_datetime,
            end_datetime__gt=start_datetime,
        ).exclude(status=ScheduleStatus.CANCELLED)
        if schedule_id:
            query = query.exclude(id=schedule_id)
        if query.exists():
            raise ValidationError({"non_field_errors": ["El usuario ya tiene una agenda activa en ese rango horario."]})
