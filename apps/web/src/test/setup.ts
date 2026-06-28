// Étend les assertions Vitest avec les matchers DOM de Testing Library
// (toBeInTheDocument, toHaveAttribute, etc.) et nettoie le DOM après chaque test.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
