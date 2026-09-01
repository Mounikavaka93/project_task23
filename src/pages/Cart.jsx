import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import { coverThumb } from '../utils/finish'
import QuantitySelector from '../components/common/QuantitySelector'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/ui/Button'
import Container from '../components/ui/Container'

export default function Cart() {
  const { items, updateQty, remove, subtotal, count } = useCart()
  const { push } = useToast()
  const shipping = subtotal >= 1200 || subtotal === 0 ? 0 : 85
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="The bag is empty"
        body="Nothing waiting at the atelier yet. The collection is patient."
        action="Enter the collection"
        to="/shop"
      />
    )
  }

  return (
    <Container className="grid gap-12 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-4xl italic md:text-5xl">Your bag</h1>
        <p className="mt-2 text-sm text-subtle">{count} piece{count === 1 ? '' : 's'}</p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.key} className="flex flex-col gap-4 py-6 sm:flex-row">
              <Link to={`/product/${item.product.slug}`} className="h-28 w-24 shrink-0 overflow-hidden bg-muted">
                <img
                  src={coverThumb(item.product, item.color)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="font-display text-xl italic">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-subtle">{item.color}</p>
                  </div>
                  <p className="shrink-0 text-sm">{formatPrice(item.product.price * item.qty)}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <QuantitySelector
                    value={item.qty}
                    onChange={(n) => updateQty(item.key, n)}
                    max={Math.min(10, item.product.stock || 10)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      remove(item.key)
                      push('Removed from bag', 'info')
                    }}
                    className="inline-flex items-center gap-1 text-xs text-subtle hover:text-danger"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-line bg-elevated p-6 lg:sticky lg:top-24">
        <h2 className="text-[11px] tracking-[0.22em] uppercase">Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-subtle">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-subtle">White-glove</dt>
            <dd>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-subtle">Estimated tax</dt>
            <dd>{formatPrice(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        {subtotal < 1200 && (
          <p className="mt-4 text-xs text-subtle">
            {formatPrice(1200 - subtotal)} more for complimentary delivery.
          </p>
        )}
        <Button to="/checkout" size="lg" className="mt-6 w-full">
          Checkout
        </Button>
        <Link
          to="/shop"
          className="mt-3 block text-center text-[11px] tracking-[0.16em] text-subtle uppercase hover:text-ink"
        >
          Continue composing
        </Link>
      </aside>
    </Container>
  )
}
