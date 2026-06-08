from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from tests.factories import create_user, create_user_with_role, schedule_payload


class ScheduleManagementE2ETests(APITestCase):
    def test_coordinator_creates_schedule_and_engineer_updates_status(self):
        coordinator = create_user_with_role("e2e-coord@example.com", "coordinator", ["schedules:write"])
        engineer = create_user("e2e-engineer@example.com")
        start = timezone.now() + timedelta(days=1)

        login = self.client.post(
            reverse("auth-login"),
            {"email": coordinator.email, "password": "StrongPass123"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        create_response = self.client.post(
            reverse("schedules-list"),
            schedule_payload(engineer, start),
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        engineer_login = self.client.post(
            reverse("auth-login"),
            {"email": engineer.email, "password": "StrongPass123"},
            format="json",
        )
        self.assertEqual(engineer_login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {engineer_login.data['access']}")

        status_response = self.client.patch(
            reverse("schedules-operational-status", args=[create_response.data["id"]]),
            {"operational_status": "completed"},
            format="json",
        )
        self.assertEqual(status_response.status_code, status.HTTP_200_OK)
        self.assertEqual(status_response.data["operational_status"], "completed")

    def test_conflict_flow_blocks_same_user_but_allows_different_user(self):
        coordinator = create_user_with_role("e2e-conflict-coord@example.com", "coordinator", ["schedules:write"])
        engineer_one = create_user("e2e-one@example.com")
        engineer_two = create_user("e2e-two@example.com")
        start = timezone.now() + timedelta(days=1)
        self.client.force_authenticate(coordinator)

        first = self.client.post(reverse("schedules-list"), schedule_payload(engineer_one, start), format="json")
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        conflict = self.client.post(
            reverse("schedules-list"),
            schedule_payload(engineer_one, start + timedelta(minutes=30), title="Cruce"),
            format="json",
        )
        self.assertEqual(conflict.status_code, status.HTTP_400_BAD_REQUEST)

        allowed = self.client.post(
            reverse("schedules-list"),
            schedule_payload(engineer_two, start + timedelta(minutes=30), title="Otro ingeniero"),
            format="json",
        )
        self.assertEqual(allowed.status_code, status.HTTP_201_CREATED)
