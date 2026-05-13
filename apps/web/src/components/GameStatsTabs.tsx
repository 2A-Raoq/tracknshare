import { useEffect, useMemo, useState } from 'react'
import type { PlayerStatsData } from '../types/stats'
import GameProviderBadge from './GameProviderBadge'

type GameStatsTabsProps = {
  stats: PlayerStatsData[]
}

function getDefaultStatId(items: PlayerStatsData[]) {
  if (items.length === 0) {
    return ''
  }

  const steamItem = items.find((item) => item.provider === 'STEAM')
  return steamItem?.id ?? items[0].id
}

function formatPlaytime(minutes: number) {
  return `${Math.round(minutes / 60)}h`
}

export default function GameStatsTabs({ stats }: GameStatsTabsProps) {
  const [activeStatId, setActiveStatId] = useState('')

  const availableStats = useMemo(() => stats.filter(Boolean), [stats])

  useEffect(() => {
    if (availableStats.length === 0) {
      setActiveStatId('')
      return
    }

    const hasCurrent = availableStats.some((item) => item.id === activeStatId)
    if (!hasCurrent) {
      setActiveStatId(getDefaultStatId(availableStats))
    }
  }, [activeStatId, availableStats])

  const activeStat = availableStats.find((item) => item.id === activeStatId) ?? availableStats[0]

  if (!activeStat) {
    return <div className="empty-box">Aucune statistique disponible.</div>
  }

  return (
    <div className="section-stack">
      <div className="stats-tabs__bar" role="tablist" aria-label="Jeux suivis">
        {availableStats.map((item) => {
          const isActive = item.id === activeStat.id
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`stats-tab${isActive ? ' stats-tab--active' : ''}`}
              onClick={() => setActiveStatId(item.id)}
            >
              {item.game?.imageUrl ? (
                <img src={item.game.imageUrl} alt="" className="stats-tab__image" />
              ) : (
                <div className="stats-tab__image stats-tab__image--empty">
                  {item.provider === 'STEAM' ? 'ST' : 'MK'}
                </div>
              )}
              <div className="stats-tab__content">
                <strong>{item.game?.name ?? 'Jeu'}</strong>
                <GameProviderBadge provider={item.provider} />
              </div>
            </button>
          )
        })}
      </div>

      <article className="data-card stats-tab-panel">
        <div className="panel-header">
          <div>
            <p className="muted-text">{activeStat.season?.name ?? 'Saison'}</p>
            <h2>{activeStat.game?.name ?? 'Jeu'}</h2>
          </div>
          <GameProviderBadge provider={activeStat.provider} score={activeStat.score} />
        </div>

        <div className="info-grid">
          <div className="status-card">
            <p className="muted-text">Score</p>
            <h2 style={{ marginTop: '6px' }}>{activeStat.score}</h2>
          </div>
          <div className="status-card">
            <p className="muted-text">K/D</p>
            <h2 style={{ marginTop: '6px' }}>{activeStat.kdRatio.toFixed(2)}</h2>
          </div>
          <div className="status-card">
            <p className="muted-text">Winrate</p>
            <h2 style={{ marginTop: '6px' }}>{activeStat.winrate}%</h2>
          </div>
        </div>

        <ul className="metric-list">
          <li className="metric-row">Parties jouées : {activeStat.matchesPlayed}</li>
          <li className="metric-row">Wins / Losses : {activeStat.wins} / {activeStat.losses}</li>
          <li className="metric-row">Kills / Deaths : {activeStat.kills} / {activeStat.deaths}</li>
          <li className="metric-row">Temps de jeu : {formatPlaytime(activeStat.playtimeMinutes)}</li>
        </ul>
      </article>
    </div>
  )
}
