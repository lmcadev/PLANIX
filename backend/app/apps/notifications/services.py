from .models import Notification


class NotificationService:
    @staticmethod
    def create(user, title, message):
        return Notification.objects.create(user=user, title=title, message=message)
