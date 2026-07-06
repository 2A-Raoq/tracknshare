/**
 * Origines CORS autorisées, partagées entre le serveur HTTP (main.ts) et les
 * gateways Socket.io. CORS_ORIGIN accepte plusieurs origines séparées par des
 * virgules ; fallback : front Vite en dev.
 */
export function getCorsOrigins(): string[] {
  return (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}
