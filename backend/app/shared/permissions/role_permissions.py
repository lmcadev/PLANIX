from rest_framework.permissions import SAFE_METHODS, BasePermission


ADMIN_ROLE = "admin"
COORDINATOR_ROLE = "coordinator"
READONLY_ROLE = "readonly"


def user_role_names(user):
    if not user or not user.is_authenticated:
        return set()
    if user.is_superuser:
        return {ADMIN_ROLE}
    return {ur.role.name.lower() for ur in user.user_roles.select_related("role")}


def user_permission_codes(user):
    if not user or not user.is_authenticated:
        return set()
    if user.is_superuser:
        return {"*"}
    codes = set()
    for user_role in user.user_roles.select_related("role").prefetch_related("role__permissions"):
        codes.update(permission.code for permission in user_role.role.permissions.all())
    return codes


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and ADMIN_ROLE in user_role_names(request.user)


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and ADMIN_ROLE in user_role_names(request.user)


class SchedulePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        if getattr(view, "action", None) == "operational_status":
            return True
        roles = user_role_names(request.user)
        permissions = user_permission_codes(request.user)
        can_write = ADMIN_ROLE in roles or COORDINATOR_ROLE in roles or "schedules:write" in permissions or "*" in permissions
        return can_write

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        if getattr(view, "action", None) == "operational_status":
            roles = user_role_names(request.user)
            return obj.assigned_user_id == request.user.id or ADMIN_ROLE in roles or COORDINATOR_ROLE in roles
        return self.has_permission(request, view)


class NotificationOwnerPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and obj.user_id == request.user.id
