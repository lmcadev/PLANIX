import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/templates/DashboardLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import SchedulesPage from "../pages/SchedulesPage";
import ScheduleFormPage from "../pages/ScheduleFormPage";
import UsersPage from "../pages/UsersPage";
import UserFormPage from "../pages/UserFormPage";
import RolesPage from "../pages/RolesPage";
import RoleFormPage from "../pages/RoleFormPage";
import PermissionsPage from "../pages/PermissionsPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotFoundPage from "../pages/NotFoundPage";
import { ROLE_NAMES } from "../constants/roles";
import { ROUTES } from "../constants/routes";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.SCHEDULES} element={<SchedulesPage />} />
          <Route path={ROUTES.SCHEDULE_NEW} element={<ScheduleFormPage />} />
          <Route path={ROUTES.SCHEDULE_EDIT} element={<ScheduleFormPage />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

          <Route element={<ProtectedRoute allowedRoles={[ROLE_NAMES.ADMIN]} />}>
            <Route path={ROUTES.USERS} element={<UsersPage />} />
            <Route path={ROUTES.USER_NEW} element={<UserFormPage />} />
            <Route path={ROUTES.USER_EDIT} element={<UserFormPage />} />
            <Route path={ROUTES.ROLES} element={<RolesPage />} />
            <Route path={ROUTES.ROLE_NEW} element={<RoleFormPage />} />
            <Route path={ROUTES.ROLE_EDIT} element={<RoleFormPage />} />
            <Route path={ROUTES.PERMISSIONS} element={<PermissionsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
