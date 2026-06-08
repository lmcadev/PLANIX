from rest_framework import serializers

from apps.notifications.services import NotificationService
from .models import OperationalStatus, Schedule, ScheduleExceptionDate
from .services import ScheduleConflictService


class ScheduleExceptionDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleExceptionDate
        fields = ("id", "exception_date")
        read_only_fields = ("id",)


class ScheduleSerializer(serializers.ModelSerializer):
    exception_dates = ScheduleExceptionDateSerializer(many=True, required=False)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Schedule
        fields = (
            "id", "title", "description", "assigned_user", "start_datetime", "end_datetime",
            "location", "meeting_link", "status", "operational_status", "is_recurring",
            "recurrence_type", "recurrence_interval", "recurrence_end_date", "created_by",
            "exception_dates", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_by", "created_at", "updated_at")

    def validate(self, attrs):
        instance = getattr(self, "instance", None)
        assigned_user = attrs.get("assigned_user", getattr(instance, "assigned_user", None))
        start_datetime = attrs.get("start_datetime", getattr(instance, "start_datetime", None))
        end_datetime = attrs.get("end_datetime", getattr(instance, "end_datetime", None))
        ScheduleConflictService.validate_time_range(start_datetime, end_datetime)
        ScheduleConflictService.validate_no_conflict(assigned_user, start_datetime, end_datetime, getattr(instance, "id", None))
        return attrs

    def create(self, validated_data):
        exception_dates = validated_data.pop("exception_dates", [])
        schedule = Schedule.objects.create(created_by=self.context["request"].user, **validated_data)
        self._sync_exception_dates(schedule, exception_dates)
        NotificationService.create(
            user=schedule.assigned_user,
            title="Nueva agenda asignada",
            message=f"Se te asigno la agenda: {schedule.title}",
        )
        return schedule

    def update(self, instance, validated_data):
        exception_dates = validated_data.pop("exception_dates", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if exception_dates is not None:
            instance.exception_dates.all().delete()
            self._sync_exception_dates(instance, exception_dates)
        return instance

    def _sync_exception_dates(self, schedule, exception_dates):
        ScheduleExceptionDate.objects.bulk_create([
            ScheduleExceptionDate(schedule=schedule, exception_date=item["exception_date"])
            for item in exception_dates
        ], ignore_conflicts=True)


class OperationalStatusSerializer(serializers.Serializer):
    operational_status = serializers.ChoiceField(choices=OperationalStatus.choices)
