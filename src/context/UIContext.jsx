import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <UIContext.Provider
      value={{
        searchOpen,
        setSearchOpen,
        quickView,
        setQuickView,
        mobileNav,
        setMobileNav,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => useContext(UIContext)
