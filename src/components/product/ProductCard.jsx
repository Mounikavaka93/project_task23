import { Heart, GitCompareArrows, Eye } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice, calcDiscount, compareToast } from '../../utils/format'
import { coverThumb } from '../../utils/finish'
import { useWishlist } from '../../context/WishlistContext'
import { useCompare } from '../../context/CompareContext'
import { useUI } from '../../context/UIContext'
import { useToast } from '../../context/ToastContext'
import LazyImage from '../common/LazyImage'

export default function ProductCard({ product, index = 0 }) {
  const { has, toggle } = useWishlist()
  const { has: inCompare, toggle: toggleCompare } = useCompare()
  const { setQuickView } = useUI()
  const { push } = useToast()
  const saved = has(product.id)
  const compared = inCompare(product.id)
  const discount = calcDiscount(product.price, product.originalPrice)
  const [finish, setFinish] = useState(product.colors[0].name)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link to={`/product/${product.slug}`} className="block h-full">
          <LazyImage
            src={coverThumb(product, finish)}
            alt={`${product.name} · ${finish}`}
            className="h-full w-full"
            imgClass="group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-ink px-2 py-0.5 text-[9px] tracking-[0.18em] text-elevated uppercase">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-accent px-2 py-0.5 text-[9px] tracking-[0.18em] text-white uppercase">
              −{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-elevated/90 px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase">
              Waitlist
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            toggle(product.id)
            push(saved ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
          }}
          className="absolute top-3 right-3 grid h-9 w-9 place-items-center bg-elevated/90 text-ink transition hover:bg-elevated"
          aria-label="Toggle wishlist"
        >
          <Heart size={15} className={saved ? 'fill-accent text-accent' : ''} />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
          <button
            type="button"
            onClick={() => setQuickView(product)}
            className="flex flex-1 items-center justify-center gap-1.5 bg-elevated py-2 text-[10px] tracking-[0.16em] uppercase"
          >
            <Eye size={13} /> Quick view
          </button>
          <button
            type="button"
            onClick={() => {
              const result = toggleCompare(product.id)
              push(compareToast(result), 'info')
            }}
            className={`grid h-9 w-9 place-items-center ${compared ? 'bg-ink text-elevated' : 'bg-elevated'}`}
            aria-label="Compare"
          >
            <GitCompareArrows size={14} />
          </button>
        </div>
      </div>
      <Link to={`/product/${product.slug}`} className="mt-3 block">
        <p className="text-[10px] tracking-[0.2em] text-subtle uppercase">{product.category}</p>
        <h3 className="mt-1 font-display text-xl leading-tight italic">{product.name}</h3>
        <p className="mt-1.5 text-sm">
          {formatPrice(product.price)}
          {product.originalPrice && (
            <span className="ml-2 text-subtle line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
      </Link>
      {product.colors.length > 1 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={finish === c.name}
              onClick={() => setFinish(c.name)}
              className={`h-8 w-8 overflow-hidden ${
                finish === c.name ? 'outline outline-2 outline-ink outline-offset-1' : 'outline outline-1 outline-line outline-offset-1'
              }`}
            >
              <img src={c.images[0]} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.article>
  )
}
