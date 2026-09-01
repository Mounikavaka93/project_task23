import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import ProductGrid from '../components/product/ProductGrid'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'
import PageHeader from '../components/ui/PageHeader'

export default function Wishlist() {
  const { items, clear } = useWishlist()
  const { add } = useCart()
  const { push } = useToast()

  if (!items.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Nothing saved yet"
        body="Tap the heart on a piece you may want later. It will wait here."
        action="Browse the collection"
        to="/shop"
      />
    )
  }

  const inStock = items.filter((p) => p.inStock)

  return (
    <Container className="py-12">
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        subtitle={`${items.length} piece${items.length === 1 ? '' : 's'}`}
        className="border-b border-line pb-8"
      >
        <div className="flex flex-wrap gap-3">
          {inStock.length > 0 && (
            <Button
              size="sm"
              onClick={() => {
                inStock.forEach((p) => add(p, { qty: 1 }))
                push(`${inStock.length} piece${inStock.length === 1 ? '' : 's'} added to bag`)
              }}
            >
              <ShoppingBag size={14} /> Add available to bag
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="border border-line hover:border-ink"
            onClick={() => {
              clear()
              push('Wishlist cleared', 'info')
            }}
          >
            Clear all
          </Button>
        </div>
      </PageHeader>
      <div className="mt-10">
        <ProductGrid products={items} />
      </div>
    </Container>
  )
}
