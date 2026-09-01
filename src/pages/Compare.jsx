import { Link } from 'react-router-dom'
import { GitCompareArrows } from 'lucide-react'
import { useCompare } from '../context/CompareContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import EmptyState from '../components/common/EmptyState'
import LazyImage from '../components/common/LazyImage'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import PageHeader from '../components/ui/PageHeader'

const rows = [
  { key: 'price', label: 'Price', render: (p) => formatPrice(p.price) },
  { key: 'category', label: 'Room', render: (p) => p.category },
  { key: 'rating', label: 'Rating', render: (p) => `${p.rating} (${p.reviews})` },
  { key: 'materials', label: 'Materials', render: (p) => p.materials.join(', ') },
  { key: 'dimensions', label: 'Dimensions', render: (p) => p.dimensions },
  { key: 'weight', label: 'Weight', render: (p) => p.weight },
  { key: 'warranty', label: 'Warranty', render: (p) => p.warranty },
  { key: 'assembly', label: 'Assembly', render: (p) => p.assembly },
  { key: 'stock', label: 'Availability', render: (p) => (p.inStock ? 'In atelier' : 'Waitlist') },
]

export default function Compare() {
  const { items, remove, clear } = useCompare()
  const { add } = useCart()
  const { push } = useToast()

  if (!items.length) {
    return (
      <EmptyState
        icon={GitCompareArrows}
        title="Nothing to compare"
        body="Add up to three pieces from the collection. A tray will appear at the bottom of the screen."
        action="Start comparing"
        to="/shop"
      />
    )
  }

  return (
    <Container className="py-12">
      <PageHeader eyebrow="Side by side" title="Compare">
        <button type="button" onClick={clear} className="text-[11px] tracking-widest text-subtle uppercase">
          Clear all
        </button>
      </PageHeader>
      <div className="mt-10 overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-36" />
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left align-top">
                  <LazyImage
                    src={p.images[0]}
                    alt={p.name}
                    className="mb-3 aspect-[4/5] w-full"
                    sizes="33vw"
                  />
                  <Link to={`/product/${p.slug}`} className="font-display text-2xl italic">
                    {p.name}
                  </Link>
                  <div className="mt-3 flex flex-col items-start gap-2">
                    <Button
                      size="sm"
                      disabled={!p.inStock}
                      onClick={() => {
                        add(p)
                        push(`${p.name} added to bag`)
                      }}
                    >
                      {p.inStock ? 'Add to bag' : 'Waitlist'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="text-[10px] tracking-widest text-subtle uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-line">
                <td className="py-4 pr-4 text-[10px] tracking-[0.16em] text-subtle uppercase">{row.label}</td>
                {items.map((p) => (
                  <td key={p.id} className="py-4 pr-4 capitalize">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}
