import { useRef, useState } from 'react'
import { EMOJI_CATEGORIES, ALL_EMOJIS } from '../data/emojis'
import { useClickOutside } from '../hooks/useClickOutside'

interface Props {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].id)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, onClose)

  const filtered = search.trim()
    ? ALL_EMOJIS.filter(
        (e) =>
          e.name.includes(search.toLowerCase()) ||
          e.keywords.some((k) => k.includes(search.toLowerCase())),
      )
    : EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.emojis ?? []

  return (
    <div className="emoji-picker" ref={ref} role="dialog" aria-label="Sélecteur d'émojis">
      <div className="emoji-picker__search-row">
        <input
          className="emoji-picker__search"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      {!search && (
        <div className="emoji-picker__tabs">
          {EMOJI_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`emoji-picker__tab${activeCategory === cat.id ? ' emoji-picker__tab--active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      <div className="emoji-picker__grid">
        {filtered.length === 0 && (
          <p className="emoji-picker__empty">Aucun résultat</p>
        )}
        {filtered.map((item) => (
          <button
            key={item.name}
            type="button"
            className="emoji-picker__item"
            onClick={() => onSelect(item.emoji)}
            title={`:${item.name}:`}
            aria-label={item.name}
          >
            {item.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
