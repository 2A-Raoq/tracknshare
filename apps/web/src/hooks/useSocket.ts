import { useEffect } from 'react'
import { socket } from '../lib/socket'

export function useSocket() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [])
}