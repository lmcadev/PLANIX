from datetime import timedelta

from django.utils import timezone

from apps.roles.models import Permission, Role, RolePermission, UserRole
from apps.schedules.models import Schedule
from apps.users.models import User


def create_user(email="user@example.com", password="StrongPass123", **kwargs):
    defaults = {
        "first_name": "Test",
        "last_name": "User",
        "is_active": True,
    }
    defaults.update(kwargs)
    return User.objects.create_user(email=email, password=password, **defaults)


def create_role(name, permission_codes=None):
    role = Role.objects.create(name=name, description=f"{name} role")
    for code in permission_codes or []:
        permission, _ = Permission.objects.get_or_create(
            code=code,
            defaults={"name": code, "description": f"Permission {code}"},
        )
        RolePermission.objects.create(role=role, permission=permission)
    return role


def assign_role(user, role):
    return UserRole.objects.create(user=user, role=role)


def create_user_with_role(email, role_name, permission_codes=None, **kwargs):
    user = create_user(email=email, **kwargs)
    role = create_role(role_name, permission_codes)
    assign_role(user, role)
    return user


def schedule_payload(assigned_user, start=None, **overrides):
    start = start or (timezone.now() + timedelta(days=1))
    data = {
        "title": "Mantenimiento preventivo",
        "description": "Revision de sitio",
        "assigned_user": assigned_user.id,
        "start_datetime": start.isoformat(),
        "end_datetime": (start + timedelta(hours=2)).isoformat(),
        "location": "Bogota",
        "meeting_link": "https://meet.example.com/planix",
        "status": "busy",
        "operational_status": "waiting",
        "is_recurring": False,
        "recurrence_type": "none",
        "recurrence_interval": 1,
    }
    data.update(overrides)
    return data


def create_schedule(assigned_user, created_by=None, start=None, **kwargs):
    start = start or (timezone.now() + timedelta(days=1))
    defaults = {
        "title": "Agenda de prueba",
        "description": "Actividad de prueba",
        "assigned_user": assigned_user,
        "created_by": created_by or assigned_user,
        "start_datetime": start,
        "end_datetime": start + timedelta(hours=2),
        "location": "Bogota",
        "meeting_link": "https://meet.example.com/planix",
        "status": "busy",
        "operational_status": "waiting",
    }
    defaults.update(kwargs)
    return Schedule.objects.create(**defaults)
