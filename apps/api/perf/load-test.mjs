/**
 * Test de charge Track'N Share — preuve RNCP BC01-6 (estimation de la charge).
 *
 * Cible par défaut l'endpoint PUBLIC du leaderboard solo, représentatif du
 * chemin critique en lecture (PostgreSQL + cache Redis + pagination cursor).
 *
 * Lancement (aucune installation requise) :
 *   node apps/api/perf/load-test.mjs
 *   TARGET=http://localhost:3000/api/leaderboards/solo CONNECTIONS=50 DURATION=30 \
 *     node apps/api/perf/load-test.mjs
 *
 * Prérequis : l'API doit tourner (docker compose up, ou pnpm --filter api dev).
 * autocannon est récupéré à la volée via `pnpm dlx` s'il n'est pas installé.
 */
import { spawn } from 'node:child_process'

const TARGET = process.env.TARGET ?? 'http://localhost:3000/api/leaderboards/solo?limit=20'
const CONNECTIONS = process.env.CONNECTIONS ?? '50'
const DURATION = process.env.DURATION ?? '30'

const args = [
  'dlx',
  'autocannon',
  '-c',
  CONNECTIONS,
  '-d',
  DURATION,
  '-l', // histogramme de latence détaillé
  TARGET,
]

console.log(`\n▶ Test de charge : ${CONNECTIONS} connexions, ${DURATION}s → ${TARGET}\n`)

const child = spawn('pnpm', args, { stdio: 'inherit', shell: process.platform === 'win32' })

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(
      '\n✖ Échec. Vérifie que l\'API tourne (docker compose up) et réessaie.\n' +
        '  Alternative directe : pnpm dlx autocannon -c 50 -d 30 ' +
        TARGET,
    )
  }
  process.exit(code ?? 0)
})
