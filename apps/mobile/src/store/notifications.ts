import { proxy } from 'valtio'

/** Bannière de notification in-app (pas de push système : tout reste dans l'app). */
export interface AppNotification {
  id: string
  title: string
  body: string
  kind: 'private' | 'team'
  /** conversationId (privé) ou teamId (équipe) pour la navigation au tap. */
  threadId: string
}

export const notificationStore = proxy({
  /** Notification actuellement affichée (une à la fois). */
  current: null as AppNotification | null,
  /** Fil ouvert à l'écran : sert à ne pas notifier une conversation déjà visible. */
  activeThread: null as string | null,
})

let seq = 0

/** Affiche une nouvelle bannière (remplace la précédente si besoin). */
export function pushNotification(n: Omit<AppNotification, 'id'>) {
  seq += 1
  notificationStore.current = { ...n, id: `ntf-${seq}` }
}

export function dismissNotification() {
  notificationStore.current = null
}

/** Déclaré par les écrans de chat pour éviter de se notifier soi-même le fil ouvert. */
export function setActiveThread(id: string | null) {
  notificationStore.activeThread = id
}
