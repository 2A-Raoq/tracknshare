import { Platform } from 'react-native'

/**
 * URL de l'API NestJS existante.
 * - Émulateur Android : 10.0.2.2 (alias de la machine hôte)
 * - Simulateur iOS / web : localhost
 * - Device physique : définir EXPO_PUBLIC_API_URL = http://<IP_LAN_DE_LA_MACHINE>:3000/api
 */
const fallbackApiUrl = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
})

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl
export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL ?? API_URL.replace(/\/api\/?$/, '')
