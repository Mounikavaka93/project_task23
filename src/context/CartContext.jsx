import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getProductById } from '../data/products'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useLocalStorage('velora-cart', [])

  const capFor = (product) => Math.max(1, Math.min(10, product.stock || 10))

  const add = (product, { qty = 1, color } = {}) => {
    if (!product.inStock) return
    const cap = capFor(product)
    setItems((prev) => {
      const key = `${product.id}-${color || product.colors[0].name}`
      const found = prev.find((i) => i.key === key)
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: Math.min(i.qty + qty, cap) } : i
        )
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          qty: Math.min(qty, cap),
          color: color || product.colors[0].name,
        },
      ]
    })
  }

  const updateQty = (key, qty) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.key !== key) return i
          const product = getProductById(i.id)
          const cap = product ? capFor(product) : 10
          return { ...i, qty: Math.max(1, Math.min(cap, qty)) }
        })
        .filter((i) => i.qty > 0)
    )
  }

  const remove = (key) => setItems((prev) => prev.filter((i) => i.key !== key))
  const clear = () => setItems([])

  const hydrated = useMemo(
    () =>
      items
        .map((i) => {
          const product = getProductById(i.id)
          if (!product) return null
          return { ...i, product }
        })
        .filter(Boolean),
    [items]
  )

  const count = hydrated.reduce((s, i) => s + i.qty, 0)
  const subtotal = hydrated.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items: hydrated, add, updateQty, remove, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
