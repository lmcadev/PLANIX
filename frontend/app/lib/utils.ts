import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Paginated } from '~/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** El backend no tiene paginacion configurada (devuelve arrays planos),
 * pero este helper deja el frontend a salvo si en el futuro se activa. */
export function unwrapList<T>(data: Paginated<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}
