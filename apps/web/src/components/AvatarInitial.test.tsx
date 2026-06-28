import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AvatarInitial from './AvatarInitial'

describe('AvatarInitial', () => {
  it('affiche la première lettre du pseudo en majuscule', () => {
    render(<AvatarInitial username="demo" />)
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('affiche « ? » quand aucun pseudo n’est fourni', () => {
    render(<AvatarInitial username={null} />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('applique la taille demandée', () => {
    render(<AvatarInitial username="Zoe" size={48} />)
    const el = screen.getByText('Z')
    expect(el).toHaveStyle({ width: '48px', height: '48px' })
  })

  it('attribue une couleur déterministe selon le pseudo', () => {
    const { container: c1 } = render(<AvatarInitial username="demo" />)
    const { container: c2 } = render(<AvatarInitial username="demo" />)
    const bg1 = (c1.firstChild as HTMLElement).style.background
    const bg2 = (c2.firstChild as HTMLElement).style.background
    expect(bg1).toBe(bg2)
    expect(bg1).not.toBe('')
  })
})
