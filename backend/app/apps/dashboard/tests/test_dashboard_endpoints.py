from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.schedules.models import ScheduleStatus
from tests.factories import create_schedule, create_user


class DashboardEndpointTests(APITestCase):
    def test_authenticated_user_gets_kpis(self):
        user = create_user("dashboard@example.com")
        self.client.force_authenticate(user)
        create_schedule(
            assigned_user=user,
            created_by=user,
            start=timezone.now() + timedelta(days=1),
            status=ScheduleStatus.COMPLETED,
        )
        response = self.client.get(reverse("dashboard-kpis"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_schedules"], 1)

    def test_anonymous_user_cannot_get_kpis(self):
        response = self.client.get(reverse("dashboard-kpis"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
