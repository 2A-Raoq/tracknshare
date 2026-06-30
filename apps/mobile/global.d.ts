/// <reference types="expo/types" />

// Déclarations pour les imports CSS du template Expo (web).
declare module '*.css'
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
