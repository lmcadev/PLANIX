from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.notifications.models import Notification
from tests.factories import create_user


class NotificationEndpointTests(APITestCase):
    def test_user_lists_only_own_notifications(self):
        user = create_user("notify@example.com")
        other = create_user("other-notify@example.com")
        Notification.objects.create(user=user, title="Propia", message="Mensaje")
        Notification.objects.create(user=other, title="Ajena", message="Mensaje")
        self.client.force_authenticate(user)

        response = self.client.get(reverse("notifications-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Propia")

    def test_user_marks_own_notification_as_read(self):
        user = create_user("read-notify@example.com")
        notification = Notification.objects.create(user=user, title="Pendiente", message="Mensaje")
        self.client.force_authenticate(user)

        response = self.client.patch(reverse("notifications-read", args=[notification.id]), format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)

    def test_user_cannot_mark_other_notification_as_read(self):
        user = create_user("owner-notify@example.com")
        other = create_user("other-owner-notify@example.com")
        notification = Notification.objects.create(user=other, title="Ajena", message="Mensaje")
        self.client.force_authenticate(user)

        response = self.client.patch(reverse("notifications-read", args=[notification.id]), format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
