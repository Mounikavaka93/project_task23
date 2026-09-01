import { createContext, useCallback, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getProductById } from '../data/products'

const RecentlyViewedContext = createContext(null)

export function RecentlyViewedProvider({ children }) {
  const [ids, setIds] = useLocalStorage('velora-recent', [])

  const track = useCallback(
    (id) => setIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8)),
    [setIds]
  )

  const items = ids.map(getProductById).filter(Boolean)

  return (
    <RecentlyViewedContext.Provider value={{ items, track }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)
