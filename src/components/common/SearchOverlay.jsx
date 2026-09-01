import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFeatured, products } from '../../data/products'
import { categories } from '../../data/categories'
import { useUI } from '../../context/UIContext'
import { useDebounce } from '../../hooks/useDebounce'
import { useLockBody } from '../../hooks/useLockBody'
import { formatPrice } from '../../utils/format'

function matches(product, term) {
  return (
    product.name.toLowerCase().includes(term) ||
    product.category.includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.materials.some((m) => m.toLowerCase().includes(term)) ||
    product.colors.some((c) => c.name.toLowerCase().includes(term))
  )
}

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useUI()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const debounced = useDebounce(q, 160)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useLockBody(searchOpen)

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setQ('')
      setActive(0)
    }
  }, [searchOpen])

  const results = useMemo(() => {
    const term = debounced.trim().toLowerCase()
    if (!term) return []
    return products.filter((p) => matches(p, term)).slice(0, 6)
  }, [debounced])

  const catHits = useMemo(() => {
    const term = debounced.trim().toLowerCase()
    if (!term) return []
    return categories
      .filter((c) => c.name.toLowerCase().includes(term) || c.id.includes(term) || c.subtitle.toLowerCase().includes(term))
      .slice(0, 3)
  }, [debounced])

  const popular = useMemo(() => getFeatured().slice(0, 4), [])

  const suggestions = useMemo(() => {
    const term = debounced.trim()
    if (!term) {
      return popular.map((p) => ({ type: 'product', product: p, path: `/product/${p.slug}` }))
    }
    const list = [
      ...catHits.map((c) => ({ type: 'category', category: c, path: `/shop/${c.id}` })),
      ...results.map((p) => ({ type: 'product', product: p, path: `/product/${p.slug}` })),
    ]
    if (results.length) {
      list.push({
        type: 'all',
        path: `/shop?q=${encodeURIComponent(term)}`,
        label: `See all results for “${term}”`,
      })
    }
    return list
  }, [debounced, catHits, results, popular])

  useEffect(() => {
    setActive(0)
  }, [debounced])

  const go = (path) => {
    setSearchOpen(false)
    navigate(path)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  const onInputKey = (e) => {
    if (e.key === 'Escape') {
      setSearchOpen(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((n) => Math.min(n + 1, Math.max(suggestions.length - 1, 0)))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((n) => Math.max(n - 1, 0))
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions[active]) go(suggestions[active].path)
      else if (q.trim()) go(`/shop?q=${encodeURIComponent(q.trim())}`)
    }
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/40 px-4 pt-[10vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl border border-line bg-elevated shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={18} className="text-subtle" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search chairs, oak, lighting…"
                className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-subtle"
                aria-autocomplete="list"
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2 no-scrollbar">
              {!debounced.trim() && (
                <p className="px-3 py-2 text-[10px] tracking-[0.18em] text-subtle uppercase">
                  Suggested
                </p>
              )}
              {debounced.trim() && !suggestions.length && (
                <p className="px-3 py-6 text-center text-xs text-subtle">
                  No matches for “{debounced}”. Try oak, sofa, or lighting.
                </p>
              )}
              {suggestions.map((item, i) => (
                <button
                  key={item.path + i}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item.path)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                    active === i ? 'bg-muted' : 'hover:bg-muted'
                  }`}
                >
                  {item.type === 'category' && (
                    <>
                      <span className="grid h-12 w-12 place-items-center border border-line text-[10px] tracking-widest uppercase">
                        {item.category.roman}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">Category · {item.category.name}</p>
                        <p className="text-[11px] text-subtle">{item.category.subtitle}</p>
                      </div>
                    </>
                  )}
                  {item.type === 'product' && (
                    <>
                      <img
                        src={item.product.images[0]}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{item.product.name}</p>
                        <p className="text-[11px] capitalize text-subtle">{item.product.category}</p>
                      </div>
                      <span className="text-sm">{formatPrice(item.product.price)}</span>
                    </>
                  )}
                  {item.type === 'all' && (
                    <span className="py-1 text-sm">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
            <p className="border-t border-line px-4 py-2 text-[10px] tracking-widest text-subtle uppercase">
              ↑↓ to move · Enter to open · Esc to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
