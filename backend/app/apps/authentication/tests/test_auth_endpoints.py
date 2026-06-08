from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationEndpointTests(APITestCase):
    def test_register_and_login_returns_tokens(self):
        payload = {
            "first_name": "Ana",
            "last_name": "Torres",
            "email": "ana@example.com",
            "password": "StrongPass123",
        }
        response = self.client.post(reverse("auth-register"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        login_response = self.client.post(
            reverse("auth-login"),
            {"email": payload["email"], "password": payload["password"]},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data)
        self.assertIn("refresh", login_response.data)

    def test_login_rejects_invalid_credentials(self):
        response = self.client.post(
            reverse("auth-login"),
            {"email": "missing@example.com", "password": "WrongPass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_returns_new_access_token(self):
        self.client.post(
            reverse("auth-register"),
            {"email": "refresh@example.com", "password": "StrongPass123"},
            format="json",
        )
        login_response = self.client.post(
            reverse("auth-login"),
            {"email": "refresh@example.com", "password": "StrongPass123"},
            format="json",
        )
        response = self.client.post(
            reverse("auth-refresh"),
            {"refresh": login_response.data["refresh"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_logout_blacklists_refresh_token(self):
        self.client.post(
            reverse("auth-register"),
            {"email": "logout@example.com", "password": "StrongPass123"},
            format="json",
        )
        login_response = self.client.post(
            reverse("auth-login"),
            {"email": "logout@example.com", "password": "StrongPass123"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
        response = self.client.post(
            reverse("auth-logout"),
            {"refresh": login_response.data["refresh"]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
