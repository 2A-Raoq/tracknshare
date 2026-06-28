import { describe, it, expect } from 'vitest'
import { searchEmojis, ALL_EMOJIS } from './emojis'

describe('searchEmojis', () => {
  it('trouve un émoji par son nom', () => {
    const results = searchEmojis('smile')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((e) => e.name.includes('smile') || e.keywords.some((k) => k.includes('smile')))).toBe(true)
  })

  it('est insensible à la casse', () => {
    expect(searchEmojis('SMILE')).toEqual(searchEmojis('smile'))
  })

  it('cherche aussi dans les mots-clés (pas seulement le nom)', () => {
    // « content » est un mot-clé (😀 grinning) absent des noms d'émojis anglais.
    const results = searchEmojis('content')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((e) => e.keywords.includes('content'))).toBe(true)
  })

  it('limite les résultats à 8 maximum', () => {
    // Une chaîne vide matche tout -> doit être tronquée à 8.
    expect(searchEmojis('').length).toBeLessThanOrEqual(8)
  })

  it('renvoie un tableau vide quand rien ne correspond', () => {
    expect(searchEmojis('zzzzz-aucun-emoji')).toEqual([])
  })

  it('expose un catalogue non vide', () => {
    expect(ALL_EMOJIS.length).toBeGreaterThan(0)
  })
})
