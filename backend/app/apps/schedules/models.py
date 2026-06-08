from django.conf import settings
from django.db import models
from django.utils import timezone


class ScheduleStatus(models.TextChoices):
    AVAILABLE = "available", "Disponible"
    BUSY = "busy", "Ocupado"
    CANCELLED = "cancelled", "Cancelado"
    COMPLETED = "completed", "Finalizado"


class OperationalStatus(models.TextChoices):
    WAITING = "waiting", "En espera"
    IN_PROGRESS = "in_progress", "En proceso"
    COMPLETED = "completed", "Finalizado"
    CANCELLED = "cancelled", "Cancelado"
    POSTPONED = "postponed", "Aplazado"


class RecurrenceType(models.TextChoices):
    NONE = "none", "Sin recurrencia"
    DAILY = "daily", "Diaria"
    WEEKLY = "weekly", "Semanal"
    MONTHLY = "monthly", "Mensual"


class Schedule(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="assigned_schedules")
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    meeting_link = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=ScheduleStatus.choices, default=ScheduleStatus.BUSY)
    operational_status = models.CharField(max_length=20, choices=OperationalStatus.choices, default=OperationalStatus.WAITING)
    is_recurring = models.BooleanField(default=False)
    recurrence_type = models.CharField(max_length=20, choices=RecurrenceType.choices, default=RecurrenceType.NONE)
    recurrence_interval = models.PositiveIntegerField(default=1)
    recurrence_end_date = models.DateField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_schedules")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("start_datetime",)

    def __str__(self):
        return self.title


class ScheduleExceptionDate(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name="exception_dates")
    exception_date = models.DateField()

    class Meta:
        unique_together = ("schedule", "exception_date")
