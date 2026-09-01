import { categories } from '../../data/categories'
import { allMaterials, PRICE_MAX } from '../../data/products'
import { formatPrice } from '../../utils/format'
import { SlidersHorizontal, X } from 'lucide-react'

export default function Filters({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  materials,
  setMaterials,
  inStockOnly,
  setInStockOnly,
  onClose,
}) {
  const toggleMat = (m) =>
    setMaterials((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]))

  return (
    <aside className="space-y-8">
      <div className="flex items-center justify-between lg:hidden">
        <p className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
          <SlidersHorizontal size={14} /> Filters
        </p>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close filters">
            <X size={18} />
          </button>
        )}
      </div>

      <div>
        <p className="mb-3 text-[10px] tracking-[0.22em] text-subtle uppercase">Category</p>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`text-sm ${category === 'all' ? 'text-ink' : 'text-subtle hover:text-ink'}`}
            >
              All rooms
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setCategory(c.id)}
                className={`text-sm capitalize ${
                  category === c.id ? 'text-ink' : 'text-subtle hover:text-ink'
                }`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-[10px] tracking-[0.22em] text-subtle uppercase">
          Price up to {formatPrice(maxPrice)}
        </p>
        <input
          type="range"
          min={200}
          max={PRICE_MAX}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <p className="mb-3 text-[10px] tracking-[0.22em] text-subtle uppercase">Material</p>
        <ul className="space-y-2">
          {allMaterials.map((m) => (
            <li key={m}>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={materials.includes(m)}
                  onChange={() => toggleMat(m)}
                  className="accent-accent"
                />
                {m}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="accent-accent"
        />
        In stock only
      </label>
    </aside>
  )
}
