import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GitCompareArrows, Heart, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUI } from '../../context/UIContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useToast } from '../../context/ToastContext'
import { useCompare } from '../../context/CompareContext'
import { useRecentlyViewed } from '../../context/RecentlyViewedContext'
import { useLockBody } from '../../hooks/useLockBody'
import { formatPrice, compareToast } from '../../utils/format'
import { coverThumb } from '../../utils/finish'
import QuantitySelector from './QuantitySelector'
import LazyImage from './LazyImage'
import Button from '../ui/Button'

export default function QuickView() {
  const { quickView: product, setQuickView } = useUI()
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const { push } = useToast()
  const { has: inCompare, toggle: toggleCompare } = useCompare()
  const { track } = useRecentlyViewed()
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)

  useLockBody(Boolean(product))

  const close = useCallback(() => {
    setQuickView(null)
    setQty(1)
    setColor(null)
  }, [setQuickView])

  useEffect(() => {
    setQty(1)
    setColor(product?.colors[0]?.name || null)
    if (product) track(product.id)
  }, [product, track])

  useEffect(() => {
    if (!product) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, close])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-line bg-elevated no-scrollbar md:grid-cols-2 md:overflow-hidden"
          >
            <LazyImage
              src={coverThumb(product, color || product.colors[0].name)}
              alt={`${product.name} · ${color || product.colors[0].name}`}
              className="h-64 w-full md:h-full md:min-h-[420px]"
              sizes="(max-width: 768px) 100vw, 50vw"
              eager
            />
            <div className="relative flex flex-col p-6 md:p-8">
              <button
                type="button"
                onClick={close}
                className="absolute top-4 right-4 text-subtle hover:text-ink"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>
              <p className="text-[10px] tracking-[0.22em] text-subtle uppercase">{product.category}</p>
              <h3 className="mt-2 font-display text-3xl italic md:text-4xl">{product.name}</h3>
              <p className="mt-3 text-lg">{formatPrice(product.price)}</p>
              <p className="mt-4 text-sm leading-relaxed text-subtle">{product.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {product.colors.map((c) => {
                  const active = (color || product.colors[0].name) === c.name
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setColor(c.name)}
                      aria-pressed={active}
                      className={`h-11 w-11 overflow-hidden ${
                        active ? 'outline outline-2 outline-ink outline-offset-1' : 'outline outline-1 outline-line outline-offset-1'
                      }`}
                    >
                      <img src={c.images[0]} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                    </button>
                  )
                })}
                <span className="ml-1 text-xs text-subtle">
                  {color || product.colors[0].name}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <QuantitySelector
                  value={qty}
                  onChange={setQty}
                  max={Math.min(10, product.stock || 1)}
                />
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!product.inStock) {
                      if (!has(product.id)) toggle(product.id)
                      push('Saved to waitlist', 'info')
                      close()
                      return
                    }
                    add(product, { qty, color: color || product.colors[0].name })
                    push(`${product.name} added to bag`)
                    close()
                  }}
                >
                  {product.inStock ? 'Add to bag' : 'Save to waitlist'}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    toggle(product.id)
                    push(has(product.id) ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
                  }}
                  className="grid h-11 w-11 place-items-center border border-line"
                  aria-label="Wishlist"
                >
                  <Heart size={16} className={has(product.id) ? 'fill-accent text-accent' : ''} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const result = toggleCompare(product.id)
                    push(compareToast(result), 'info')
                  }}
                  className={`grid h-11 w-11 place-items-center border ${
                    inCompare(product.id) ? 'border-ink bg-ink text-elevated' : 'border-line'
                  }`}
                  aria-label="Compare"
                >
                  <GitCompareArrows size={16} />
                </button>
              </div>
              <Link
                to={`/product/${product.slug}`}
                onClick={close}
                className="mt-5 text-[11px] tracking-[0.18em] text-subtle uppercase underline-offset-4 hover:text-ink hover:underline"
              >
                View full details
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
