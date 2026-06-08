from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.schedules.models import ScheduleStatus
from apps.schedules.services import ScheduleConflictService
from tests.factories import create_schedule, create_user


class ScheduleConflictServiceTests(TestCase):
    def setUp(self):
        self.user = create_user("engineer@example.com")
        self.start = timezone.now() + timedelta(days=1)
        self.end = self.start + timedelta(hours=2)

    def test_rejects_invalid_time_range(self):
        with self.assertRaises(ValidationError):
            ScheduleConflictService.validate_time_range(self.start, self.start)

    def test_rejects_overlapping_active_schedule(self):
        create_schedule(assigned_user=self.user, start=self.start)
        with self.assertRaises(ValidationError):
            ScheduleConflictService.validate_no_conflict(
                self.user,
                self.start + timedelta(minutes=30),
                self.end + timedelta(minutes=30),
            )

    def test_cancelled_schedule_does_not_block_availability(self):
        create_schedule(assigned_user=self.user, start=self.start, status=ScheduleStatus.CANCELLED)
        ScheduleConflictService.validate_no_conflict(
            self.user,
            self.start + timedelta(minutes=30),
            self.end + timedelta(minutes=30),
        )

    def test_non_overlapping_schedule_is_allowed(self):
        create_schedule(assigned_user=self.user, start=self.start)
        ScheduleConflictService.validate_no_conflict(
            self.user,
            self.end + timedelta(minutes=1),
            self.end + timedelta(hours=2),
        )

    def test_current_schedule_is_excluded_when_updating(self):
        schedule = create_schedule(assigned_user=self.user, start=self.start)
        ScheduleConflictService.validate_no_conflict(
            self.user,
            self.start,
            self.end,
            schedule_id=schedule.id,
        )
