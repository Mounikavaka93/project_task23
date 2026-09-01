import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getProductById } from '../data/products'

const CompareContext = createContext(null)
const MAX = 3

export function CompareProvider({ children }) {
  const [ids, setIds] = useLocalStorage('velora-compare', [])

  const toggle = (id) => {
    if (ids.includes(id)) {
      setIds((prev) => prev.filter((x) => x !== id))
      return 'removed'
    }
    if (ids.length >= MAX) {
      setIds((prev) => [...prev.slice(1), id])
      return 'replaced'
    }
    setIds((prev) => [...prev, id])
    return 'added'
  }

  const remove = (id) => setIds((prev) => prev.filter((x) => x !== id))
  const clear = () => setIds([])
  const has = (id) => ids.includes(id)
  const items = ids.map(getProductById).filter(Boolean)

  return (
    <CompareContext.Provider value={{ ids, items, toggle, remove, clear, has, max: MAX }}>
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext)
