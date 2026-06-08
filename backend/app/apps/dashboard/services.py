from django.db.models import DurationField, ExpressionWrapper, F, Sum

from apps.schedules.models import Schedule, ScheduleStatus


class DashboardService:
    @staticmethod
    def get_kpis():
        total = Schedule.objects.count()
        completed = Schedule.objects.filter(status=ScheduleStatus.COMPLETED).count()
        cancelled = Schedule.objects.filter(status=ScheduleStatus.CANCELLED).count()
        pending = Schedule.objects.exclude(status__in=[ScheduleStatus.COMPLETED, ScheduleStatus.CANCELLED]).count()
        compliance = round((completed / total) * 100, 2) if total else 0
        duration = ExpressionWrapper(F("end_datetime") - F("start_datetime"), output_field=DurationField())
        occupied_by_user = (
            Schedule.objects.exclude(status=ScheduleStatus.CANCELLED)
            .annotate(duration=duration)
            .values("assigned_user_id", "assigned_user__email")
            .annotate(total_duration=Sum("duration"))
            .order_by("assigned_user__email")
        )
        return {
            "total_schedules": total,
            "completed_schedules": completed,
            "cancelled_schedules": cancelled,
            "pending_schedules": pending,
            "compliance_percentage": compliance,
            "occupied_hours_by_user": [
                {
                    "user_id": row["assigned_user_id"],
                    "email": row["assigned_user__email"],
                    "hours": round(row["total_duration"].total_seconds() / 3600, 2) if row["total_duration"] else 0,
                }
                for row in occupied_by_user
            ],
        }
