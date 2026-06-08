from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.notifications.models import Notification
from apps.roles.models import Permission, Role, RolePermission, UserRole
from apps.schedules.models import Schedule, ScheduleExceptionDate, ScheduleStatus
from apps.users.models import User


class Command(BaseCommand):
    help = "Puebla la base de datos con datos demo para desarrollo."

    def handle(self, *args, **options):
        permissions = self.create_permissions()
        roles = self.create_roles(permissions)
        users = self.create_users(roles)
        schedules = self.create_schedules(users)
        self.create_notifications(users)

        self.stdout.write(self.style.SUCCESS("Datos demo creados correctamente."))
        self.stdout.write(f"Permisos: {len(permissions)}")
        self.stdout.write(f"Roles: {len(roles)}")
        self.stdout.write(f"Usuarios: {len(users)}")
        self.stdout.write(f"Agendas: {len(schedules)}")

    def create_permissions(self):
        payload = [
            ("Lectura de agendas", "schedules:read", "Permite consultar agendas."),
            ("Escritura de agendas", "schedules:write", "Permite crear y editar agendas."),
            ("Lectura de usuarios", "users:read", "Permite consultar usuarios."),
            ("Escritura de usuarios", "users:write", "Permite gestionar usuarios."),
            ("Lectura de dashboard", "dashboard:read", "Permite consultar KPIs."),
        ]
        permissions = []
        for name, code, description in payload:
            permission, _ = Permission.objects.update_or_create(
                code=code,
                defaults={"name": name, "description": description},
            )
            permissions.append(permission)
        return permissions

    def create_roles(self, permissions):
        permission_by_code = {permission.code: permission for permission in permissions}
        role_payload = {
            "admin": {
                "description": "Administrador del sistema.",
                "permissions": list(permission_by_code.values()),
            },
            "coordinator": {
                "description": "Coordinador de agendas.",
                "permissions": [
                    permission_by_code["schedules:read"],
                    permission_by_code["schedules:write"],
                    permission_by_code["dashboard:read"],
                ],
            },
            "readonly": {
                "description": "Usuario de consulta.",
                "permissions": [
                    permission_by_code["schedules:read"],
                    permission_by_code["users:read"],
                    permission_by_code["dashboard:read"],
                ],
            },
        }
        roles = {}
        for name, data in role_payload.items():
            role, _ = Role.objects.update_or_create(name=name, defaults={"description": data["description"]})
            RolePermission.objects.filter(role=role).delete()
            RolePermission.objects.bulk_create(
                [RolePermission(role=role, permission=permission) for permission in data["permissions"]],
                ignore_conflicts=True,
            )
            roles[name] = role
        return roles

    def create_users(self, roles):
        user_payload = [
            ("admin@planix.local", "Admin", "Planix", roles["admin"], True, True),
            ("coordinator@planix.local", "Carolina", "Mendez", roles["coordinator"], False, False),
            ("reader@planix.local", "Ricardo", "Lopez", roles["readonly"], False, False),
            ("engineer.one@planix.local", "Laura", "Gomez", roles["readonly"], False, False),
            ("engineer.two@planix.local", "Miguel", "Rojas", roles["readonly"], False, False),
            ("engineer.three@planix.local", "Sofia", "Castro", roles["readonly"], False, False),
        ]
        users = {}
        for email, first_name, last_name, role, is_staff, is_superuser in user_payload:
            user, created = User.objects.update_or_create(
                email=email,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "is_staff": is_staff,
                    "is_superuser": is_superuser,
                    "is_active": True,
                },
            )
            if created:
                user.set_password("PlanixDemo123")
                user.save()
            UserRole.objects.get_or_create(user=user, role=role)
            users[email] = user
        return users

    def create_schedules(self, users):
        coordinator = users["coordinator@planix.local"]
        engineer_one = users["engineer.one@planix.local"]
        engineer_two = users["engineer.two@planix.local"]
        engineer_three = users["engineer.three@planix.local"]
        base = timezone.now().replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=1)
        payload = [
            ("Revision planta norte", engineer_one, base, 2, ScheduleStatus.BUSY, "waiting"),
            ("Calibracion sensores", engineer_two, base + timedelta(hours=3), 2, ScheduleStatus.BUSY, "in_progress"),
            ("Informe de cierre", engineer_three, base + timedelta(days=1), 1, ScheduleStatus.COMPLETED, "completed"),
            ("Visita tecnica cliente A", engineer_one, base + timedelta(days=1, hours=2), 2, ScheduleStatus.BUSY, "waiting"),
            ("Mantenimiento correctivo", engineer_two, base + timedelta(days=2), 3, ScheduleStatus.CANCELLED, "cancelled"),
            ("Inspeccion electrica", engineer_three, base + timedelta(days=2, hours=4), 2, ScheduleStatus.BUSY, "postponed"),
            ("Reunion de seguimiento", engineer_one, base + timedelta(days=3), 1, ScheduleStatus.AVAILABLE, "waiting"),
            ("Actualizacion firmware", engineer_two, base + timedelta(days=3, hours=2), 2, ScheduleStatus.BUSY, "waiting"),
        ]
        schedules = []
        for title, assigned_user, start, hours, status, operational_status in payload:
            schedule, _ = Schedule.objects.update_or_create(
                title=title,
                assigned_user=assigned_user,
                defaults={
                    "description": f"Actividad demo: {title}.",
                    "start_datetime": start,
                    "end_datetime": start + timedelta(hours=hours),
                    "location": "Bogota",
                    "meeting_link": "https://meet.example.com/planix-demo",
                    "status": status,
                    "operational_status": operational_status,
                    "is_recurring": title in {"Reunion de seguimiento", "Actualizacion firmware"},
                    "recurrence_type": "weekly" if title in {"Reunion de seguimiento", "Actualizacion firmware"} else "none",
                    "recurrence_interval": 1,
                    "recurrence_end_date": (start + timedelta(days=30)).date() if title in {"Reunion de seguimiento", "Actualizacion firmware"} else None,
                    "created_by": coordinator,
                },
            )
            if schedule.is_recurring:
                ScheduleExceptionDate.objects.get_or_create(
                    schedule=schedule,
                    exception_date=(start + timedelta(days=14)).date(),
                )
            schedules.append(schedule)
        return schedules

    def create_notifications(self, users):
        for user in users.values():
            Notification.objects.get_or_create(
                user=user,
                title="Bienvenido a PLANIX",
                defaults={"message": "Tu usuario demo esta listo para pruebas."},
            )
