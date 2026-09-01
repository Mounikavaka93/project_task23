import { Link } from 'react-router-dom'
import { useRecentlyViewed } from '../../context/RecentlyViewedContext'
import ProductCard from './ProductCard'

export default function RecentlyViewed({ excludeId, title = 'Recently viewed', nested = false }) {
  const { items } = useRecentlyViewed()
  const list = items.filter((p) => p.id !== excludeId).slice(0, 4)
  if (!list.length) return null

  return (
    <section className={nested ? 'mt-20' : 'w-full px-3 py-16'}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl italic">{title}</h2>
        <Link to="/shop" className="text-[11px] tracking-[0.18em] text-subtle uppercase hover:text-ink">
          Collection →
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}
