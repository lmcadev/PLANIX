// Tipos alineados 1:1 con los serializers de backend/app/apps/*

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface JwtPayload {
  token_type: "access" | "refresh";
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  permission_ids?: number[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface UserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  is_active?: boolean;
  role_ids?: number[];
}

export type ScheduleStatus = "available" | "busy" | "cancelled" | "completed";

export type OperationalStatus =
  | "waiting"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "postponed";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface ScheduleExceptionDate {
  id: number;
  exception_date: string;
}

export interface Schedule {
  id: number;
  title: string;
  description: string;
  assigned_user: number;
  start_datetime: string;
  end_datetime: string;
  location: string;
  meeting_link: string;
  status: ScheduleStatus;
  operational_status: OperationalStatus;
  is_recurring: boolean;
  recurrence_type: RecurrenceType;
  recurrence_interval: number;
  recurrence_end_date: string | null;
  created_by: number;
  exception_dates: ScheduleExceptionDate[];
  created_at: string;
  updated_at: string;
}

export interface SchedulePayload {
  title: string;
  description?: string;
  assigned_user: number;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  meeting_link?: string;
  status?: ScheduleStatus;
  is_recurring?: boolean;
  recurrence_type?: RecurrenceType;
  recurrence_interval?: number;
  recurrence_end_date?: string | null;
  exception_dates?: { exception_date: string }[];
}

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface OccupiedHoursByUser {
  user_id: number;
  email: string;
  hours: number;
}

export interface DashboardKPIs {
  total_schedules: number;
  completed_schedules: number;
  cancelled_schedules: number;
  pending_schedules: number;
  compliance_percentage: number;
  occupied_hours_by_user: OccupiedHoursByUser[];
}

export interface ApiError {
  detail?: string;
  [field: string]: unknown;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
