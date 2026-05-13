type GameProviderBadgeProps = {
  provider: string
  score?: number
}

export default function GameProviderBadge({ provider, score }: GameProviderBadgeProps) {
  const normalized = provider?.toUpperCase() === 'STEAM' ? 'STEAM' : 'MOCK'

  return (
    <span className={`provider-badge provider-badge--${normalized.toLowerCase()}`}>
      <span className="provider-badge__label">{normalized}</span>
      {typeof score === 'number' && (
        <span className="provider-badge__score">Score {score}</span>
      )}
    </span>
  )
}
