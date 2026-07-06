/**
 * Limiteur de débit minimal en mémoire pour les gateways Socket.io.
 * Fenêtre glissante par socket.id — aucune dépendance externe.
 * Penser à appeler `clear(socketId)` au disconnect pour libérer la mémoire.
 */
export class SocketRateLimiter {
  private readonly timestamps = new Map<string, number[]>()

  constructor(
    private readonly maxEvents = 10,
    private readonly windowMs = 10_000,
  ) {}

  /**
   * Retourne true si le socket dépasse la limite. Sinon, enregistre
   * l'événement et retourne false.
   */
  isRateLimited(socketId: string): boolean {
    const now = Date.now()
    const recent = (this.timestamps.get(socketId) ?? []).filter(
      (timestamp) => now - timestamp < this.windowMs,
    )

    if (recent.length >= this.maxEvents) {
      this.timestamps.set(socketId, recent)
      return true
    }

    recent.push(now)
    this.timestamps.set(socketId, recent)
    return false
  }

  clear(socketId: string): void {
    this.timestamps.delete(socketId)
  }
}
