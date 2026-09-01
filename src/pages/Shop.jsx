import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { products, PRICE_MAX } from '../data/products'
import { categories } from '../data/categories'
import Filters from '../components/product/Filters'
import ProductGrid from '../components/product/ProductGrid'
import { ProductGridSkeleton } from '../components/common/Skeleton'
import RecentlyViewed from '../components/product/RecentlyViewed'
import { useLockBody } from '../hooks/useLockBody'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import PageHeader from '../components/ui/PageHeader'

const PAGE = 8
const CATEGORY_IDS = categories.map((c) => c.id)

export default function Shop() {
  const { category: catParam } = useParams()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const category = catParam || 'all'
  const setCategory = (id) => {
    const path = id === 'all' ? '/shop' : `/shop/${id}`
    const qs = params.toString()
    navigate(qs ? `${path}?${qs}` : path)
  }
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX)
  const [materials, setMaterials] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState(params.get('sort') || 'featured')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState(false)
  const sentinel = useRef(null)
  const q = params.get('q') || ''
  useLockBody(drawer)

  useEffect(() => {
    setLoading(true)
    setPage(1)
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [category, maxPrice, materials, inStockOnly, sort, q])

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'all') list = list.filter((p) => p.category === category)
    list = list.filter((p) => p.price <= maxPrice)
    if (materials.length) list = list.filter((p) => p.materials.some((m) => materials.includes(m)))
    if (inStockOnly) list = list.filter((p) => p.inStock)
    if (q) {
      const term = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.materials.some((m) => m.toLowerCase().includes(term))
      )
    }
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'newest') list.sort((a, b) => Number(b.isNew) - Number(a.isNew))
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'featured') list.sort((a, b) => Number(b.featured) - Number(a.featured))
    return list
  }, [category, maxPrice, materials, inStockOnly, sort, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE) || 1)
  const safePage = Math.min(page, totalPages)
  const shown = filtered.slice(0, safePage * PAGE)

  useEffect(() => {
    const el = sentinel.current
    if (!el || loading || safePage >= totalPages) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        if (window.scrollY < 240) return
        setPage((p) => Math.min(p + 1, totalPages))
      },
      { rootMargin: '240px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loading, safePage, totalPages, filtered.length])

  const title =
    category === 'all'
      ? q
        ? `Results for “${q}”`
        : 'The collection'
      : categories.find((c) => c.id === category)?.name || 'Collection'

  if (catParam && !CATEGORY_IDS.includes(catParam)) {
    return <Navigate to="/shop" replace />
  }

  const goPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 180, behavior: 'smooth' })
  }

  return (
    <Container className="py-12">
      <PageHeader
        eyebrow="Atelier"
        title={title}
        subtitle={`${filtered.length} pieces`}
        className="mb-6 border-b border-line pb-8"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[11px] tracking-[0.16em] uppercase lg:hidden"
          >
            <SlidersHorizontal size={14} /> Filter
          </button>
          <select
            value={sort}
            onChange={(e) => {
              const value = e.target.value
              setSort(value)
              const next = new URLSearchParams(params)
              next.set('sort', value)
              setParams(next)
            }}
            className="h-10 min-w-0 max-w-full flex-1 border border-line bg-bg px-2 text-sm text-ink outline-none sm:px-3 sm:flex-none"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price · low to high</option>
            <option value="price-desc">Price · high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </PageHeader>

      <div className="mb-10 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`shrink-0 border px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase ${
            category === 'all' ? 'border-ink bg-ink text-elevated' : 'border-line hover:border-ink'
          }`}
        >
          All rooms
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`shrink-0 border px-3 py-1.5 text-[11px] tracking-[0.16em] uppercase ${
              category === c.id ? 'border-ink bg-ink text-elevated' : 'border-line hover:border-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <Filters
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            materials={materials}
            setMaterials={setMaterials}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />
        </div>
        <div>
          {loading ? (
            <ProductGridSkeleton />
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-subtle">
                Nothing in this edit. Loosen a filter or search another word.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setMaterials([])
                  setMaxPrice(PRICE_MAX)
                  setInStockOnly(false)
                  setCategory('all')
                  const next = new URLSearchParams(params)
                  next.delete('q')
                  next.delete('sort')
                  setParams(next)
                  setSort('featured')
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <>
              <ProductGrid products={shown} />
              {shown.length < filtered.length && (
                <div ref={sentinel} className="flex flex-col items-center gap-3 py-10">
                  <p className="text-xs tracking-widest text-subtle uppercase">
                    Showing {shown.length} of {filtered.length}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  >
                    Load more
                  </Button>
                </div>
              )}
              {totalPages > 1 && (
                <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={safePage <= 1}
                    onClick={() => goPage(safePage - 1)}
                    className="grid h-10 w-10 place-items-center border border-line disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goPage(n)}
                      aria-current={n === safePage ? 'page' : undefined}
                      className={`grid h-10 min-w-10 place-items-center border px-2 text-sm ${
                        n === safePage ? 'border-ink bg-ink text-elevated' : 'border-line hover:border-ink'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={safePage >= totalPages}
                    onClick={() => goPage(safePage + 1)}
                    className="grid h-10 w-10 place-items-center border border-line disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {drawer && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
          onClick={() => setDrawer(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div
            className="h-full w-[min(100%,320px)] overflow-y-auto bg-bg p-6 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <Filters
              category={category}
              setCategory={setCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              materials={materials}
              setMaterials={setMaterials}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onClose={() => setDrawer(false)}
            />
          </div>
        </div>
      )}

      <RecentlyViewed nested />
    </Container>
  )
}
