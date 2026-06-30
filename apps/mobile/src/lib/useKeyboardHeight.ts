import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

/**
 * Hauteur courante du clavier (0 s'il est fermé).
 * Fiable avec l'edge-to-edge d'Expo SDK 54, contrairement à
 * KeyboardAvoidingView qui ne décale pas correctement la barre de saisie.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, (e) =>
      setHeight(e.endCoordinates?.height ?? 0),
    )
    const hideSub = Keyboard.addListener(hideEvent, () => setHeight(0))

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return height
}
