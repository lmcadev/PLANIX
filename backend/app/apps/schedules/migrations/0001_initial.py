import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(
            name="Schedule",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("description", models.TextField(blank=True)),
                ("start_datetime", models.DateTimeField()),
                ("end_datetime", models.DateTimeField()),
                ("location", models.CharField(blank=True, max_length=255)),
                ("meeting_link", models.URLField(blank=True)),
                ("status", models.CharField(choices=[("available", "Disponible"), ("busy", "Ocupado"), ("cancelled", "Cancelado"), ("completed", "Finalizado")], default="busy", max_length=20)),
                ("operational_status", models.CharField(choices=[("waiting", "En espera"), ("in_progress", "En proceso"), ("completed", "Finalizado"), ("cancelled", "Cancelado"), ("postponed", "Aplazado")], default="waiting", max_length=20)),
                ("is_recurring", models.BooleanField(default=False)),
                ("recurrence_type", models.CharField(choices=[("none", "Sin recurrencia"), ("daily", "Diaria"), ("weekly", "Semanal"), ("monthly", "Mensual")], default="none", max_length=20)),
                ("recurrence_interval", models.PositiveIntegerField(default=1)),
                ("recurrence_end_date", models.DateField(blank=True, null=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("assigned_user", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="assigned_schedules", to=settings.AUTH_USER_MODEL)),
                ("created_by", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="created_schedules", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("start_datetime",)},
        ),
        migrations.CreateModel(
            name="ScheduleExceptionDate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("exception_date", models.DateField()),
                ("schedule", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="exception_dates", to="schedules.schedule")),
            ],
            options={"unique_together": {("schedule", "exception_date")}},
        ),
    ]
