from rest_framework import decorators, response, status, viewsets
from rest_framework.exceptions import PermissionDenied

from shared.permissions.role_permissions import SchedulePermission, user_role_names
from .models import Schedule
from .serializers import OperationalStatusSerializer, ScheduleSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.select_related("assigned_user", "created_by").prefetch_related("exception_dates")
    serializer_class = ScheduleSerializer
    permission_classes = [SchedulePermission]

    @decorators.action(detail=True, methods=["patch"], url_path="operational-status")
    def operational_status(self, request, pk=None):
        schedule = self.get_object()
        roles = user_role_names(request.user)
        if schedule.assigned_user_id != request.user.id and "admin" not in roles and "coordinator" not in roles:
            raise PermissionDenied("Solo el usuario asignado o un usuario autorizado puede actualizar el estado operativo.")
        serializer = OperationalStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule.operational_status = serializer.validated_data["operational_status"]
        schedule.save(update_fields=["operational_status", "updated_at"])
        return response.Response(ScheduleSerializer(schedule, context={"request": request}).data, status=status.HTTP_200_OK)
