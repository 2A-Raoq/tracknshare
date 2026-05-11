import AchievementIcon from './AchievementIcons'
import type { AchievementItem } from '../types/achievements'

interface AchievementCardProps {
  achievement: AchievementItem
  variant?: 'progress' | 'public'
}

export default function AchievementCard({ achievement, variant = 'public' }: AchievementCardProps) {
  const {
    name,
    description,
    iconKey,
    points,
    unlocked = true,
    currentValue = 0,
    targetValue = 1,
    progressPercent = 100,
    unlockedAt,
  } = achievement

  const showBar = variant === 'progress' && targetValue > 1
  const cardClass = `achievement-card${unlocked ? ' achievement-card--unlocked' : ' achievement-card--locked'}`

  return (
    <article className={cardClass}>
      <div className="achievement-card__header">
        <div className={`achievement-card__icon${unlocked ? ' achievement-card__icon--unlocked' : ''}`}>
          <AchievementIcon iconKey={iconKey} size={28} />
        </div>
        <div className="achievement-card__body">
          <h3 className="achievement-card__name">{name}</h3>
          <p className="achievement-card__desc">{description}</p>
        </div>
        <div className="pill">{points} pts</div>
      </div>

      {variant === 'progress' && (
        <div className="achievement-card__footer">
          {showBar && (
            <>
              <div className="achievement-progress">
                <div
                  className="achievement-progress__fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="achievement-card__progress-label">
                {currentValue} / {targetValue} — {progressPercent}%
              </p>
            </>
          )}
          <p className={`achievement-card__status${unlocked ? ' achievement-card__status--done' : ''}`}>
            {unlocked
              ? unlockedAt
                ? `Débloqué le ${new Date(unlockedAt).toLocaleDateString('fr-FR')}`
                : 'Débloqué'
              : showBar
                ? 'En cours...'
                : 'Non débloqué'}
          </p>
        </div>
      )}
    </article>
  )
}
