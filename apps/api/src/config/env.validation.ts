/**
 * Validation de la configuration au démarrage de l'application.
 *
 * Utilisée par ConfigModule.forRoot({ validate }) : si une variable critique
 * est absente ou invalide, l'application refuse de démarrer (fail-fast) plutôt
 * que de tourner dans un état non sécurisé (ex. JWT_SECRET vide).
 */
export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const errors: string[] = []

  const jwtSecret = config.JWT_SECRET
  if (typeof jwtSecret !== 'string' || jwtSecret.trim().length < 16) {
    errors.push('JWT_SECRET est requis et doit faire au moins 16 caractères.')
  }

  const encryptionKey = config.MESSAGE_ENCRYPTION_KEY
  if (typeof encryptionKey !== 'string' || encryptionKey.length === 0) {
    errors.push('MESSAGE_ENCRYPTION_KEY est requis (clé base64 de 32 octets).')
  } else {
    let keyLength = -1
    try {
      keyLength = Buffer.from(encryptionKey, 'base64').length
    } catch {
      keyLength = -1
    }
    if (keyLength !== 32) {
      errors.push(
        'MESSAGE_ENCRYPTION_KEY doit être une clé base64 décodant exactement 32 octets (AES-256).',
      )
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Configuration d'environnement invalide :\n- ${errors.join('\n- ')}`,
    )
  }

  return config
}
