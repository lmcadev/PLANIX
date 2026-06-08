from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.notifications.models import Notification
from apps.schedules.models import Schedule, ScheduleStatus
from tests.factories import create_schedule, create_user, create_user_with_role, schedule_payload


class ScheduleEndpointTests(APITestCase):
    def setUp(self):
        self.coordinator = create_user_with_role("coord@example.com", "coordinator", ["schedules:write"])
        self.engineer = create_user("eng@example.com")
        self.start = timezone.now() + timedelta(days=1)
        self.client.force_authenticate(self.coordinator)

    def test_coordinator_creates_schedule_and_notification(self):
        response = self.client.post(reverse("schedules-list"), schedule_payload(self.engineer, self.start), format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Schedule.objects.count(), 1)
        self.assertEqual(Notification.objects.filter(user=self.engineer).count(), 1)

    def test_rejects_overlapping_active_schedule(self):
        self.client.post(reverse("schedules-list"), schedule_payload(self.engineer, self.start), format="json")
        response = self.client.post(
            reverse("schedules-list"),
            schedule_payload(self.engineer, self.start + timedelta(minutes=30), title="Cruce"),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancelled_schedule_does_not_block_new_schedule(self):
        create_schedule(
            assigned_user=self.engineer,
            created_by=self.coordinator,
            start=self.start,
            status=ScheduleStatus.CANCELLED,
        )
        response = self.client.post(
            reverse("schedules-list"),
            schedule_payload(self.engineer, self.start + timedelta(minutes=30), title="Agenda permitida"),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_readonly_user_cannot_create_schedule(self):
        readonly = create_user_with_role("readonly@example.com", "readonly", ["schedules:read"])
        self.client.force_authenticate(readonly)
        response = self.client.post(reverse("schedules-list"), schedule_payload(self.engineer, self.start), format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assigned_user_updates_operational_status(self):
        schedule = create_schedule(assigned_user=self.engineer, created_by=self.coordinator, start=self.start)
        self.client.force_authenticate(self.engineer)
        response = self.client.patch(
            reverse("schedules-operational-status", args=[schedule.id]),
            {"operational_status": "in_progress"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["operational_status"], "in_progress")

    def test_unassigned_user_cannot_update_operational_status(self):
        other = create_user("other@example.com")
        schedule = create_schedule(assigned_user=self.engineer, created_by=self.coordinator, start=self.start)
        self.client.force_authenticate(other)
        response = self.client.patch(
            reverse("schedules-operational-status", args=[schedule.id]),
            {"operational_status": "in_progress"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_assigned_user_cannot_update_full_schedule(self):
        schedule = create_schedule(assigned_user=self.engineer, created_by=self.coordinator, start=self.start)
        self.client.force_authenticate(self.engineer)
        response = self.client.patch(
            reverse("schedules-detail", args=[schedule.id]),
            {"title": "Cambio no autorizado"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
