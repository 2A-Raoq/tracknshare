import { QueryFailedError } from 'typeorm'

/** Code d'erreur PostgreSQL : violation de contrainte d'unicité. */
const PG_UNIQUE_VIOLATION = '23505'

/**
 * Détecte une violation de contrainte d'unicité PostgreSQL (23505).
 * Utile pour transformer les races entre check préalable et save en 409
 * métier au lieu d'un 500 générique.
 */
export function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof QueryFailedError &&
    (error.driverError as { code?: string } | undefined)?.code === PG_UNIQUE_VIOLATION
  )
}
