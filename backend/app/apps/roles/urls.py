from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import PermissionViewSet, RoleViewSet

router = DefaultRouter()
router.register("roles", RoleViewSet, basename="roles")
router.register("permissions", PermissionViewSet, basename="permissions")

urlpatterns = [path("", include(router.urls))]
