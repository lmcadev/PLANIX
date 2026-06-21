import type { JwtPayload } from '~/types';

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 10): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  const nowSeconds = Date.now() / 1000;
  return payload.exp - skewSeconds <= nowSeconds;
}
