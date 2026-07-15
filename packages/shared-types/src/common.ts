/** Enveloppe standard des réponses de l'API NestJS : `{ success, data }`. */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
}
