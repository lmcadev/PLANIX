from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.roles.models import Permission, RolePermission
from tests.factories import create_user_with_role


class RoleAndPermissionEndpointTests(APITestCase):
    def setUp(self):
        self.admin = create_user_with_role("admin-roles@example.com", "admin", is_superuser=True, is_staff=True)
        self.client.force_authenticate(self.admin)

    def test_admin_creates_permission(self):
        response = self.client.post(
            reverse("permissions-list"),
            {"name": "Agenda write", "code": "schedules:write", "description": "Can write schedules"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Permission.objects.filter(code="schedules:write").exists())

    def test_admin_creates_role_with_permissions(self):
        permission = Permission.objects.create(name="Agenda read", code="schedules:read")
        response = self.client.post(
            reverse("roles-list"),
            {"name": "planner", "description": "Planner", "permission_ids": [permission.id]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(RolePermission.objects.filter(role__name="planner", permission=permission).exists())

    def test_non_admin_cannot_create_role(self):
        readonly = create_user_with_role("reader-roles@example.com", "readonly")
        self.client.force_authenticate(readonly)
        response = self.client.post(
            reverse("roles-list"),
            {"name": "blocked", "description": "Blocked"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
