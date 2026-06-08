from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.roles.models import Role, UserRole
from apps.users.models import User
from tests.factories import create_user, create_user_with_role


class UserEndpointTests(APITestCase):
    def setUp(self):
        self.admin = create_user_with_role("admin@example.com", "admin", is_superuser=True, is_staff=True)
        self.client.force_authenticate(self.admin)

    def test_admin_creates_user_with_roles(self):
        role = Role.objects.create(name="readonly", description="Read only")
        response = self.client.post(
            reverse("users-list"),
            {
                "first_name": "Nuevo",
                "last_name": "Usuario",
                "email": "new@example.com",
                "password": "StrongPass123",
                "is_active": True,
                "role_ids": [role.id],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email="new@example.com").exists())
        self.assertTrue(UserRole.objects.filter(user__email="new@example.com", role=role).exists())

    def test_admin_updates_user(self):
        user = create_user("edit@example.com")
        response = self.client.put(
            reverse("users-detail", args=[user.id]),
            {
                "first_name": "Editado",
                "last_name": "Usuario",
                "email": "edit@example.com",
                "is_active": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Editado")

    def test_readonly_user_cannot_create_user(self):
        readonly = create_user_with_role("readonly-user@example.com", "readonly")
        self.client.force_authenticate(readonly)
        response = self.client.post(
            reverse("users-list"),
            {"email": "blocked@example.com", "password": "StrongPass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_user_can_list_users(self):
        readonly = create_user_with_role("reader@example.com", "readonly")
        self.client.force_authenticate(readonly)
        response = self.client.get(reverse("users-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
