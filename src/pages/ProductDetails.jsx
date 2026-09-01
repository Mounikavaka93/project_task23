import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { getProductBySlug, getRelated } from '../data/products'
import { finishOf } from '../utils/finish'
import ImageGallery from '../components/product/ImageGallery'
import CoverPicker from '../components/product/CoverPicker'
import QuantitySelector from '../components/common/QuantitySelector'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, calcDiscount, compareToast } from '../utils/format'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useToast } from '../context/ToastContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { useCompare } from '../context/CompareContext'
import NotFound from './NotFound'
import RecentlyViewed from '../components/product/RecentlyViewed'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'

export default function ProductDetails() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const { push } = useToast()
  const { track } = useRecentlyViewed()
  const { toggle: toggleCompare, has: inCompare } = useCompare()
  const [qty, setQty] = useState(1)
  const [color, setColor] = useState(null)
  const [tab, setTab] = useState('story')

  useEffect(() => {
    if (!product) return
    track(product.id)
    setColor(product.colors[0].name)
    setQty(1)
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [product, track])

  if (!product) return <NotFound />

  const activeColor =
    (color && product.colors.some((c) => c.name === color) && color) || product.colors[0].name
  const finish = finishOf(product, activeColor)
  const discount = calcDiscount(product.price, product.originalPrice)
  const related = getRelated(product)

  return (
    <Container className="py-12">
      <p className="text-[11px] text-subtle">
        <Link to="/shop" className="hover:text-ink">
          Collection
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/shop/${product.category}`} className="capitalize hover:text-ink">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        {product.name}
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <ImageGallery
            key={`${product.slug}-${activeColor}`}
            images={finish.images}
            name={`${product.name} · ${activeColor}`}
          />
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-subtle uppercase">{product.sku}</p>
          <h1 className="mt-2 font-display text-4xl italic md:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star size={14} className="fill-gold text-gold" />
            <span>{product.rating}</span>
            <span className="text-subtle">({product.reviews} reviews)</span>
          </div>
          <p className="mt-4 text-2xl">
            {formatPrice(product.price)}
            {product.originalPrice && (
              <>
                <span className="ml-3 text-base text-subtle line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="ml-2 text-sm text-accent">−{discount}%</span>
              </>
            )}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-subtle">{product.description}</p>

          <CoverPicker
            colors={product.colors}
            value={activeColor}
            onChange={setColor}
            label={product.category === 'seating' || product.category === 'bedroom' ? 'Choose cover' : 'Choose finish'}
          />

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, product.stock || 1)} />
            <Button
              size="lg"
              className="min-w-[200px] flex-1 sm:w-auto"
              onClick={() => {
                if (!product.inStock) {
                  if (!has(product.id)) toggle(product.id)
                  push('Saved to waitlist', 'info')
                  return
                }
                add(product, { qty, color: activeColor })
                push(`${product.name} added to bag`)
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
              className="grid h-12 w-12 place-items-center border border-line"
              aria-label="Wishlist"
            >
              <Heart size={18} className={has(product.id) ? 'fill-accent text-accent' : ''} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              const result = toggleCompare(product.id)
              push(compareToast(result), 'info')
            }}
            className="mt-4 text-[11px] tracking-[0.16em] text-subtle uppercase hover:text-ink"
          >
            {inCompare(product.id) ? 'Remove from compare' : 'Add to compare'}
          </button>

          <p className="mt-6 text-xs text-subtle">
            {product.inStock ? `${product.stock} in atelier · ships in 5–12 days` : 'Made to order · 4–6 weeks'}
          </p>

          <div className="mt-10 border-t border-line">
            {['story', 'details', 'care'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`mr-6 py-4 text-[11px] tracking-[0.18em] uppercase ${
                  tab === t ? 'border-b border-ink' : 'text-subtle'
                }`}
              >
                {t}
              </button>
            ))}
            <div className="py-5 text-sm leading-relaxed text-subtle">
              {tab === 'story' && product.description}
              {tab === 'details' && (
                <ul className="space-y-2">
                  <li>Dimensions · {product.dimensions}</li>
                  <li>Weight · {product.weight}</li>
                  <li>Materials · {product.materials.join(', ')}</li>
                  <li>Warranty · {product.warranty}</li>
                  <li>Assembly · {product.assembly}</li>
                  <li>{product.details}</li>
                </ul>
              )}
              {tab === 'care' &&
                'Dust with a dry cloth. Keep timber away from prolonged direct sun. Covers: cool wash, hang dry. We service what we make — write the atelier for repairs.'}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl italic">In the same room</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={product.id} nested />
    </Container>
  )
}
