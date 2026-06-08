from rest_framework import permissions, response, serializers, views
from drf_spectacular.utils import extend_schema

from .services import DashboardService


class OccupiedHoursByUserSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    email = serializers.EmailField()
    hours = serializers.FloatField()


class DashboardKPISerializer(serializers.Serializer):
    total_schedules = serializers.IntegerField()
    completed_schedules = serializers.IntegerField()
    cancelled_schedules = serializers.IntegerField()
    pending_schedules = serializers.IntegerField()
    compliance_percentage = serializers.FloatField()
    occupied_hours_by_user = OccupiedHoursByUserSerializer(many=True)


class DashboardKPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses=DashboardKPISerializer)
    def get(self, request):
        return response.Response(DashboardService.get_kpis())
