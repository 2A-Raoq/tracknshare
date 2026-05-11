const COLORS = [
  '#5865F2', '#EB459E', '#FAA61A', '#3BA55C',
  '#43B581', '#F04747', '#7289DA', '#57F287',
]

interface Props {
  username?: string | null
  size?: number
}

export default function AvatarInitial({ username, size = 36 }: Props) {
  const name = username ?? '?'
  const initial = name.charAt(0).toUpperCase()
  const color = COLORS[name.charCodeAt(0) % COLORS.length]

  return (
    <div
      className="dc-avatar"
      style={{ width: size, height: size, fontSize: size * 0.42, background: color }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
