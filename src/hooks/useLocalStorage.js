import { useEffect, useRef, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const initialRef = useRef(initialValue)
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw != null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignore quota */
    }
  }, [key, value])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return
      try {
        setValue(e.newValue != null ? JSON.parse(e.newValue) : initialRef.current)
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, setValue]
}
