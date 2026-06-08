from rest_framework import serializers

from .models import Permission, Role, RolePermission


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("id", "name", "code", "description", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class RoleSerializer(serializers.ModelSerializer):
    permission_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Role
        fields = ("id", "name", "description", "permissions", "permission_ids", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        permission_ids = validated_data.pop("permission_ids", [])
        role = Role.objects.create(**validated_data)
        RolePermission.objects.bulk_create([RolePermission(role=role, permission_id=pid) for pid in permission_ids], ignore_conflicts=True)
        return role

    def update(self, instance, validated_data):
        permission_ids = validated_data.pop("permission_ids", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if permission_ids is not None:
            RolePermission.objects.filter(role=instance).delete()
            RolePermission.objects.bulk_create([RolePermission(role=instance, permission_id=pid) for pid in permission_ids], ignore_conflicts=True)
        return instance
