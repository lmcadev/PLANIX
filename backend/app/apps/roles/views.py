from rest_framework import viewsets

from shared.permissions.role_permissions import IsAdminOrReadOnly
from .models import Permission, Role
from .serializers import PermissionSerializer, RoleSerializer


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.prefetch_related("permissions").all().order_by("id")
    serializer_class = RoleSerializer
    permission_classes = [IsAdminOrReadOnly]


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all().order_by("id")
    serializer_class = PermissionSerializer
    permission_classes = [IsAdminOrReadOnly]
