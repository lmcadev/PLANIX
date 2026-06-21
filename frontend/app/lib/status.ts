import type { OperationalStatus, ScheduleStatus } from '~/types';

export const SCHEDULE_STATUS_LABEL: Record<ScheduleStatus, string> = {
  available: 'Disponible',
  busy: 'Ocupado',
  cancelled: 'Cancelado',
  completed: 'Finalizado',
};

export const SCHEDULE_STATUS_VARIANT: Record<ScheduleStatus, 'signal' | 'amber' | 'flag' | 'grass'> = {
  available: 'grass',
  busy: 'signal',
  cancelled: 'flag',
  completed: 'amber',
};

export const OPERATIONAL_STATUS_LABEL: Record<OperationalStatus, string> = {
  waiting: 'En espera',
  in_progress: 'En proceso',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
  postponed: 'Aplazado',
};

export const OPERATIONAL_STATUS_VARIANT: Record<OperationalStatus, 'signal' | 'amber' | 'flag' | 'grass' | 'neutral'> =
  {
    waiting: 'neutral',
    in_progress: 'signal',
    completed: 'grass',
    cancelled: 'flag',
    postponed: 'amber',
  };
