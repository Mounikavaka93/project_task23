import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { categories } from '../data/categories'
import { getFeatured, products } from '../data/products'
import ProductCard from '../components/product/ProductCard'
import LazyImage from '../components/common/LazyImage'
import { ProductGridSkeleton } from '../components/common/Skeleton'
import RecentlyViewed from '../components/product/RecentlyViewed'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import Button from '../components/ui/Button'

const pins = [
  { id: 'p1', top: '58%', left: '28%', slug: 'lira-sofa' },
  { id: 'p5', top: '72%', left: '48%', slug: 'sable-coffee-table' },
  { id: 'p11', top: '38%', left: '78%', slug: 'ember-floor-lamp' },
]

const values = [
  { n: '01', t: 'Solid timber', d: 'Kiln-dried frames. No veneer pretending to be a tree.' },
  { n: '02', t: 'Small batches', d: 'We make what we can stand behind, then we stop.' },
  { n: '03', t: 'Repairable', d: 'Slipcovers, replaceable legs, a workshop that still answers.' },
  { n: '04', t: 'Quiet luxury', d: 'No logos. The grain is the signature.' },
]

export default function Home() {
  const featured = getFeatured()
  const { push } = useToast()
  const sale = products.filter((p) => p.isSale)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 480)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <section className="relative grid min-h-[calc(100svh-7rem)] w-full items-end gap-8 px-3 pb-12 md:grid-cols-12 md:items-center md:pb-16">
        <div className="relative z-10 pt-10 md:col-span-6 md:pt-0">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] tracking-[0.32em] text-accent uppercase"
          >
            Autumn atelier · 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-4 font-display text-[clamp(2.5rem,11vw,6.6rem)] leading-[0.9] font-medium tracking-tight"
          >
            Rooms
            <br />
            <span className="italic">composed,</span>
            <br />
            not furnished.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-subtle md:text-base"
          >
            Furniture with the patience of a workshop and the ease of a Sunday. Oak, linen,
            brass — pieces that stay after trends leave.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button to="/shop" size="lg">
              Enter the collection <ArrowRight size={14} />
            </Button>
            <Button to="/shop/seating" variant="outline" size="lg">
              Seating
            </Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative md:col-span-6"
        >
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
            <LazyImage
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80"
              alt="VELORA living room"
              className="h-full w-full"
              eager
            />
            <div className="absolute right-4 bottom-4 left-4 border border-white/20 bg-bg/85 p-4 backdrop-blur-md md:right-6 md:bottom-6 md:left-auto md:w-56">
              <p className="text-[10px] tracking-[0.2em] text-subtle uppercase">Featured</p>
              <p className="mt-1 font-display text-2xl italic">The Lira Sofa</p>
              <p className="mt-1 text-sm">{formatPrice(2490)}</p>
              <Link
                to="/product/lira-sofa"
                className="mt-3 inline-flex items-center gap-1 text-[10px] tracking-[0.16em] uppercase"
              >
                View piece <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
          <p className="mt-3 hidden text-[10px] tracking-[0.2em] text-subtle uppercase md:block">
            Est. 2018 · Lisbon workshop · Small batch
          </p>
        </motion.div>
      </section>

      <div className="border-y border-line bg-muted py-3">
        <div className="marquee">
          <div className="marquee-track text-[11px] tracking-[0.28em] uppercase">
            {[0, 1].map((k) => (
              <div key={k} className="flex gap-12 pr-12">
                {['European oak', 'Belgian linen', 'Aged brass', 'Plantation teak', 'Hand-thrown ceramic', 'Cane & ash'].map(
                  (t) => (
                    <span key={t + k} className="whitespace-nowrap text-subtle">
                      {t} ·
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="w-full px-3 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Index</p>
            <h2 className="mt-2 font-display text-4xl italic md:text-5xl">Six rooms</h2>
          </div>
          <Link to="/shop" className="text-[11px] tracking-[0.2em] uppercase">
            All collection →
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop/${c.id}`}
              className="group relative min-w-[200px] shrink-0 md:min-w-0"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <LazyImage
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full"
                  imgClass="transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 text-elevated">
                <p className="font-display text-2xl opacity-50">{c.roman}</p>
                <p className="font-display text-2xl italic">{c.name}</p>
                <p className="text-[10px] tracking-widest uppercase opacity-80">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="w-full px-3 py-8">
        <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Still collection</p>
            <h2 className="mt-2 font-display text-4xl italic md:text-5xl">Pieces we stand behind</h2>
          </div>
          <p className="max-w-xs text-sm text-subtle">
            A short edit. Everything else lives in the collection.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {ready ? (
            featured.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))
          ) : (
            <div className="col-span-2 md:col-span-4">
              <ProductGridSkeleton />
            </div>
          )}
        </div>
      </section>

      <section className="relative mt-16 w-full">
        <div className="relative min-h-[480px] overflow-hidden md:min-h-[640px]">
          <img
            src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1800&q=80"
            alt="Shop the room"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="relative z-10 p-8 md:p-12">
            <p className="text-[10px] tracking-[0.28em] text-white/80 uppercase">Live room</p>
            <h2 className="mt-2 font-display text-4xl text-white italic md:text-6xl">
              Shop the composition
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Hover a pin. Three pieces, one quiet room.
            </p>
          </div>
          {pins.map((pin) => {
            const product = products.find((p) => p.id === pin.id)
            return (
              <Link
                key={pin.id}
                to={`/product/${pin.slug}`}
                style={{ top: pin.top, left: pin.left }}
                className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span className="block h-5 w-5 rounded-full bg-white shadow ring-4 ring-white/30 sm:h-4 sm:w-4" />
                <span className="pointer-events-none absolute bottom-6 left-1/2 w-44 -translate-x-1/2 border border-white/20 bg-bg/95 p-3 opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100">
                  <span className="block font-display text-lg italic">{product?.name}</span>
                  <span className="mt-1 block text-xs">{formatPrice(product?.price || 0)}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid w-full gap-8 px-3 py-24 md:grid-cols-2">
        <div className="relative min-h-[340px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
            alt="Lighting offer"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/40" />
          <div className="relative z-10 flex h-full min-h-[340px] flex-col justify-end p-8 text-elevated">
            <p className="text-[10px] tracking-[0.24em] uppercase">Until equinox</p>
            <h3 className="mt-2 font-display text-4xl italic">Lighting, 12% quieter</h3>
            <Link to="/shop/lighting" className="mt-4 text-[11px] tracking-[0.2em] uppercase">
              Shop lighting →
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between border border-line bg-muted p-8 md:p-12">
          <div>
            <p className="text-[10px] tracking-[0.24em] text-accent uppercase">Offer</p>
            <h3 className="mt-3 font-display text-4xl italic md:text-5xl">
              Sale pieces, never seconds.
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-subtle">
              End-of-batch oak and last rolls of linen. Same workshop. A kinder price.
            </p>
          </div>
          <div className="mt-8 flex gap-4 overflow-x-auto no-scrollbar">
            {sale.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="min-w-[140px]">
                <LazyImage src={p.images[0]} alt={p.name} className="h-28 w-full" sizes="140px" />
                <p className="mt-2 text-xs">{p.name}</p>
                <p className="text-xs text-accent">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line">
        <div className="grid w-full md:grid-cols-4">
          {values.map((v) => (
            <div key={v.n} className="border-line px-6 py-10 md:border-r md:last:border-r-0">
              <p className="font-display text-3xl text-gold italic">{v.n}</p>
              <h3 className="mt-3 text-sm tracking-[0.14em] uppercase">{v.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-subtle">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <RecentlyViewed />

      <section className="w-full px-3 py-20">
        <div className="border border-line bg-elevated px-6 py-14 text-center md:px-16">
          <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Letter from the atelier</p>
          <h2 className="mt-3 font-display text-4xl italic md:text-5xl">Notes on making</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-subtle">
            Restocks, workshop visits, and the occasional essay on chairs. No weekly shouting.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md border border-line"
            onSubmit={(e) => {
              e.preventDefault()
              const email = new FormData(e.currentTarget).get('email')
              if (email) {
                push("You're on the atelier letter.")
                e.currentTarget.reset()
              }
            }}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              className="h-12 flex-1 bg-transparent px-4 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-ink px-5 text-[11px] tracking-[0.18em] text-elevated uppercase"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
