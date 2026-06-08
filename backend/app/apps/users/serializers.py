from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from apps.roles.models import UserRole
from apps.roles.serializers import RoleSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "is_active", "roles", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")

    @extend_schema_field(RoleSerializer(many=True))
    def get_roles(self, obj):
        return RoleSerializer([user_role.role for user_role in obj.user_roles.select_related("role")], many=True).data


class UserCreateUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, min_length=8)
    role_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password", "is_active", "role_ids")
        read_only_fields = ("id",)

    def create(self, validated_data):
        role_ids = validated_data.pop("role_ids", [])
        password = validated_data.pop("password", None)
        if not password:
            raise serializers.ValidationError({"password": "La contrasena es obligatoria al crear usuarios."})
        user = User.objects.create_user(password=password, **validated_data)
        UserRole.objects.bulk_create([UserRole(user=user, role_id=role_id) for role_id in role_ids], ignore_conflicts=True)
        return user

    def update(self, instance, validated_data):
        role_ids = validated_data.pop("role_ids", None)
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        if role_ids is not None:
            UserRole.objects.filter(user=instance).delete()
            UserRole.objects.bulk_create([UserRole(user=instance, role_id=role_id) for role_id in role_ids], ignore_conflicts=True)
        return instance
