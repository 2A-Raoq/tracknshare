import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EmojiSuggestion from './EmojiSuggestion'
import type { EmojiItem } from '../data/emojis'

const suggestions: EmojiItem[] = [
  { emoji: '😀', name: 'grinning', keywords: ['smile'] },
  { emoji: '🔥', name: 'fire', keywords: ['lit'] },
]

describe('EmojiSuggestion', () => {
  it('ne rend rien quand la liste est vide', () => {
    const { container } = render(
      <EmojiSuggestion suggestions={[]} selectedIndex={0} onSelect={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('rend une option par suggestion', () => {
    render(
      <EmojiSuggestion suggestions={suggestions} selectedIndex={0} onSelect={() => {}} />,
    )
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByText(':grinning:')).toBeInTheDocument()
  })

  it('marque l’élément sélectionné via aria-selected', () => {
    render(
      <EmojiSuggestion suggestions={suggestions} selectedIndex={1} onSelect={() => {}} />,
    )
    const options = screen.getAllByRole('option')
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('appelle onSelect avec l’émoji au clic', () => {
    const onSelect = vi.fn()
    render(
      <EmojiSuggestion suggestions={suggestions} selectedIndex={0} onSelect={onSelect} />,
    )
    fireEvent.mouseDown(screen.getByText(':fire:'))
    expect(onSelect).toHaveBeenCalledWith('🔥')
  })
})
