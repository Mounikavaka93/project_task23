import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getProductById } from '../data/products'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useLocalStorage('velora-wishlist', [])

  const toggle = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const has = (id) => ids.includes(id)
  const remove = (id) => setIds((prev) => prev.filter((x) => x !== id))
  const clear = () => setIds([])

  const items = useMemo(
    () => ids.map(getProductById).filter(Boolean),
    [ids]
  )

  return (
    <WishlistContext.Provider value={{ ids, items, toggle, has, remove, clear, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
