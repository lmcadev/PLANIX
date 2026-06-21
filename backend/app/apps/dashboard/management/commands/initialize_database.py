from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.notifications.models import Notification
from apps.roles.models import Permission, Role, RolePermission, UserRole
from apps.schedules.models import OperationalStatus, RecurrenceType, Schedule, ScheduleExceptionDate, ScheduleStatus
from apps.users.models import User


class Command(BaseCommand):
    help = "Inicializa la base de datos con roles, permisos, usuarios, agendas y notificaciones demo."

    def handle(self, *args, **options):
        permissions = self.create_permissions()
        roles = self.create_roles(permissions)
        users = self.create_users(roles)
        schedules = self.create_schedules(users)
        notifications = self.create_notifications(users)

        self.stdout.write(self.style.SUCCESS("Base de datos inicializada correctamente."))
        self.stdout.write(f"Permisos: {len(permissions)}")
        self.stdout.write(f"Roles: {len(roles)}")
        self.stdout.write(f"Usuarios: {len(users)}")
        self.stdout.write(f"Agendas: {len(schedules)}")
        self.stdout.write(f"Notificaciones: {len(notifications)}")

    def create_permissions(self):
        payload = [
            ("Lectura de agendas", "schedules:read", "Permite consultar agendas."),
            ("Escritura de agendas", "schedules:write", "Permite crear y editar agendas."),
            ("Lectura de usuarios", "users:read", "Permite consultar usuarios."),
            ("Escritura de usuarios", "users:write", "Permite gestionar usuarios."),
            ("Lectura de dashboard", "dashboard:read", "Permite consultar KPIs."),
            ("Lectura de roles", "roles:read", "Permite consultar roles."),
            ("Escritura de roles", "roles:write", "Permite crear y editar roles."),
            ("Lectura de notificaciones", "notifications:read", "Permite consultar notificaciones."),
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
                    permission_by_code["notifications:read"],
                ],
            },
            "readonly": {
                "description": "Usuario de consulta.",
                "permissions": [
                    permission_by_code["schedules:read"],
                    permission_by_code["users:read"],
                    permission_by_code["dashboard:read"],
                    permission_by_code["notifications:read"],
                ],
            },
        }
        roles = {}
        for name, data in role_payload.items():
            role, _ = Role.objects.update_or_create(
                name=name,
                defaults={"description": data["description"]},
            )
            RolePermission.objects.filter(role=role).delete()
            RolePermission.objects.bulk_create(
                [RolePermission(role=role, permission=permission) for permission in data["permissions"]],
                ignore_conflicts=True,
            )
            roles[name] = role
        return roles

    def create_users(self, roles):
        payload = [
            ("admin@planix.local", "Admin", "Planix", roles["admin"], True, True),
            ("coordinator@planix.local", "Carolina", "Mendez", roles["coordinator"], False, False),
            ("reader@planix.local", "Ricardo", "Lopez", roles["readonly"], False, False),
            ("engineer.one@planix.local", "Laura", "Gomez", roles["readonly"], False, False),
            ("engineer.two@planix.local", "Miguel", "Rojas", roles["readonly"], False, False),
            ("engineer.three@planix.local", "Sofia", "Castro", roles["readonly"], False, False),
            ("engineer.four@planix.local", "Andres", "Moreno", roles["readonly"], False, False),
            ("engineer.five@planix.local", "Valentina", "Pardo", roles["readonly"], False, False),
        ]
        users = {}
        for email, first_name, last_name, role, is_staff, is_superuser in payload:
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
        engineers = [
            users["engineer.one@planix.local"],
            users["engineer.two@planix.local"],
            users["engineer.three@planix.local"],
            users["engineer.four@planix.local"],
            users["engineer.five@planix.local"],
        ]
        base = timezone.now().replace(hour=8, minute=0, second=0, microsecond=0) + timedelta(days=1)
        titles = [
            "Revision planta norte",
            "Calibracion sensores",
            "Informe de cierre",
            "Visita tecnica cliente A",
            "Mantenimiento correctivo",
            "Inspeccion electrica",
            "Reunion de seguimiento",
            "Actualizacion firmware",
            "Auditoria de seguridad",
            "Validacion de planos",
            "Prueba de carga",
            "Entrega de reporte tecnico",
            "Inspeccion de tableros",
            "Levantamiento de requerimientos",
            "Capacitacion operativa",
            "Revision de backups",
            "Monitoreo de infraestructura",
            "Diagnostico de red",
            "Cierre de hallazgos",
            "Planeacion semanal",
        ]
        statuses = [
            ScheduleStatus.BUSY,
            ScheduleStatus.BUSY,
            ScheduleStatus.COMPLETED,
            ScheduleStatus.BUSY,
            ScheduleStatus.CANCELLED,
            ScheduleStatus.BUSY,
            ScheduleStatus.AVAILABLE,
            ScheduleStatus.BUSY,
        ]
        operational_statuses = [
            OperationalStatus.WAITING,
            OperationalStatus.IN_PROGRESS,
            OperationalStatus.COMPLETED,
            OperationalStatus.WAITING,
            OperationalStatus.CANCELLED,
            OperationalStatus.POSTPONED,
        ]
        schedules = []
        for index, title in enumerate(titles):
            start = base + timedelta(days=index // 4, hours=(index % 4) * 3)
            duration = 1 + (index % 3)
            is_recurring = index in {6, 7, 19}
            schedule, _ = Schedule.objects.update_or_create(
                title=title,
                assigned_user=engineers[index % len(engineers)],
                defaults={
                    "description": f"Actividad inicial de PLANIX: {title}.",
                    "start_datetime": start,
                    "end_datetime": start + timedelta(hours=duration),
                    "location": "Bogota",
                    "meeting_link": f"https://meet.example.com/planix-{index + 1}",
                    "status": statuses[index % len(statuses)],
                    "operational_status": operational_statuses[index % len(operational_statuses)],
                    "is_recurring": is_recurring,
                    "recurrence_type": RecurrenceType.WEEKLY if is_recurring else RecurrenceType.NONE,
                    "recurrence_interval": 1,
                    "recurrence_end_date": (start + timedelta(days=30)).date() if is_recurring else None,
                    "created_by": coordinator,
                },
            )
            if is_recurring:
                ScheduleExceptionDate.objects.get_or_create(
                    schedule=schedule,
                    exception_date=(start + timedelta(days=14)).date(),
                )
            schedules.append(schedule)
        return schedules

    def create_notifications(self, users):
        notifications = []
        for user in users.values():
            notification, _ = Notification.objects.get_or_create(
                user=user,
                title="Bienvenido a PLANIX",
                defaults={"message": "Tu usuario demo esta listo para pruebas."},
            )
            notifications.append(notification)
        return notifications
