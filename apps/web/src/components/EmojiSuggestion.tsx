import type { EmojiItem } from '../data/emojis'

interface Props {
  suggestions: EmojiItem[]
  selectedIndex: number
  onSelect: (emoji: string) => void
}

export default function EmojiSuggestion({ suggestions, selectedIndex, onSelect }: Props) {
  if (suggestions.length === 0) return null

  return (
    <ul className="emoji-suggestion" role="listbox" aria-label="Suggestions d'émojis">
      {suggestions.map((item, idx) => (
        <li
          key={item.name}
          role="option"
          aria-selected={idx === selectedIndex}
          className={`emoji-suggestion__item${idx === selectedIndex ? ' emoji-suggestion__item--selected' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault() // keep input focus
            onSelect(item.emoji)
          }}
        >
          <span className="emoji-suggestion__emoji">{item.emoji}</span>
          <span className="emoji-suggestion__name">:{item.name}:</span>
        </li>
      ))}
    </ul>
  )
}
