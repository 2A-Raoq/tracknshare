export function calculateKdRatio(kills: number, deaths: number): number {
  const d = Math.max(deaths, 1)
  return Math.round((kills / d) * 100) / 100
}

export function calculateWinrate(wins: number, matchesPlayed: number): number {
  if (matchesPlayed === 0) return 0
  return Math.round((wins / matchesPlayed) * 100)
}

export function calculateScore(kdRatio: number, winrate: number, matchesPlayed: number): number {
  if (matchesPlayed === 0) return 0
  return Math.round(kdRatio * 50 + winrate * 40 + matchesPlayed * 0.5)
}
