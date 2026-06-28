import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConsentBanner from './ConsentBanner'

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('s’affiche quand aucun consentement n’est enregistré', () => {
    render(<ConsentBanner />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('disparaît et mémorise le choix après acceptation', () => {
    render(<ConsentBanner />)
    fireEvent.click(screen.getByRole('button', { name: /compris/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(localStorage.getItem('tns_consent')).toBe('accepted')
  })

  it('ne s’affiche pas si le consentement est déjà enregistré', () => {
    localStorage.setItem('tns_consent', 'accepted')
    render(<ConsentBanner />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
