from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from apps.dashboard.services import DashboardService
from apps.schedules.models import ScheduleStatus
from tests.factories import create_schedule, create_user


class DashboardServiceTests(TestCase):
    def test_get_kpis_calculates_summary_and_hours(self):
        user = create_user("kpi@example.com")
        start = timezone.now() + timedelta(days=1)
        create_schedule(user, user, start, status=ScheduleStatus.COMPLETED)
        create_schedule(user, user, start + timedelta(hours=3), status=ScheduleStatus.CANCELLED)

        kpis = DashboardService.get_kpis()

        self.assertEqual(kpis["total_schedules"], 2)
        self.assertEqual(kpis["completed_schedules"], 1)
        self.assertEqual(kpis["cancelled_schedules"], 1)
        self.assertEqual(kpis["pending_schedules"], 0)
        self.assertEqual(kpis["compliance_percentage"], 50)
        self.assertEqual(kpis["occupied_hours_by_user"][0]["hours"], 2)
