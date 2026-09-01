import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../utils/format'
import { coverThumb } from '../utils/finish'
import { validateCheckout } from '../utils/validation'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import Container from '../components/ui/Container'

const empty = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

function CheckoutField({ name, form, errors, onChange, ...rest }) {
  return (
    <Field name={name} value={form[name]} error={errors[name]} onChange={onChange} {...rest} />
  )
}

export default function Checkout() {
  const { user } = useAuth()
  const { items, subtotal, clear } = useCart()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...empty, email: user?.email || '', fullName: user?.name || '' })
  const [errors, setErrors] = useState({})
  const [placed, setPlaced] = useState(false)
  const [pay, setPay] = useState('card')

  if (!user) return <Navigate to="/login" replace state={{ from: '/checkout' }} />
  if (!items.length && !placed) return <Navigate to="/cart" replace />

  const shipping = subtotal >= 1200 || subtotal === 0 ? 0 : 85
  const tax = Math.round(subtotal * 0.08)
  const total = subtotal + shipping + tax

  const onChange = (e) => {
    let { name, value } = e.target
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
    }
    if (name === 'expiry') {
      const digits = value.replace(/\D/g, '').slice(0, 4)
      value = digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
    }
    if (name === 'cvc') value = value.replace(/\D/g, '').slice(0, 4)
    setForm({ ...form, [name]: value })
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (pay === 'card') {
      const next = validateCheckout(form)
      setErrors(next)
      if (Object.keys(next).length) {
        push('Please complete the required fields', 'error')
        return
      }
    } else {
      const next = validateCheckout({
        ...form,
        cardName: 'x',
        cardNumber: '4111111111111111',
        expiry: '12/28',
        cvc: '123',
      })
      const rest = { ...next }
      delete rest.cardName
      delete rest.cardNumber
      delete rest.expiry
      delete rest.cvc
      setErrors(rest)
      if (Object.keys(rest).length) {
        push('Please complete the shipping address', 'error')
        return
      }
    }
    setPlaced(true)
    clear()
    push('Order placed. A confirmation is on its way.')
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Confirmed</p>
        <h1 className="mt-3 font-display text-5xl italic">The atelier has it.</h1>
        <p className="mt-4 text-sm leading-relaxed text-subtle">
          White-glove scheduling follows by email. Sit tight — or keep composing.
        </p>
        <Button type="button" size="lg" className="mt-10" onClick={() => navigate('/shop')}>
          Return to collection
        </Button>
      </div>
    )
  }

  return (
    <Container as="form" onSubmit={submit} className="grid gap-12 py-12 lg:grid-cols-[1fr_380px]" noValidate>
      <div>
        <h1 className="font-display text-4xl italic md:text-5xl">Checkout</h1>
        <section className="mt-10">
          <h2 className="text-[11px] tracking-[0.22em] uppercase">Delivery</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <CheckoutField name="fullName" label="Full name" form={form} errors={errors} onChange={onChange} />
            <CheckoutField name="email" label="Email" type="email" form={form} errors={errors} onChange={onChange} />
            <CheckoutField name="phone" label="Phone" form={form} errors={errors} onChange={onChange} />
            <CheckoutField name="country" label="Country" form={form} errors={errors} onChange={onChange} />
            <div className="sm:col-span-2">
              <CheckoutField name="address" label="Street address" form={form} errors={errors} onChange={onChange} />
            </div>
            <CheckoutField name="city" label="City" form={form} errors={errors} onChange={onChange} />
            <CheckoutField name="state" label="State" form={form} errors={errors} onChange={onChange} />
            <CheckoutField name="zip" label="Postal code" form={form} errors={errors} onChange={onChange} />
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-[11px] tracking-[0.22em] uppercase">Payment</h2>
          <div className="mt-4 flex gap-3">
            {['card', 'cod'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPay(m)}
                className={`border px-4 py-2 text-[11px] tracking-[0.16em] uppercase ${
                  pay === m ? 'border-ink bg-ink text-elevated' : 'border-line'
                }`}
              >
                {m === 'card' ? 'Card' : 'Pay on delivery'}
              </button>
            ))}
          </div>
          {pay === 'card' && (
            <div className="mt-6 border border-line bg-elevated p-5">
              <div className="mb-6 h-36 bg-gradient-to-br from-ink to-sage p-5 text-elevated">
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-70">VELORA</p>
                <p className="mt-8 font-display text-2xl tracking-[0.2em]">
                  {form.cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="mt-4 flex justify-between text-xs">
                  <span>{form.cardName || 'Name'}</span>
                  <span>{form.expiry || 'MM/YY'}</span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <CheckoutField name="cardName" label="Name on card" form={form} errors={errors} onChange={onChange} />
                </div>
                <div className="sm:col-span-2">
                  <CheckoutField
                    name="cardNumber"
                    label="Card number"
                    placeholder="ACCT-000015"
                    maxLength={19}
                    form={form}
                    errors={errors}
                    onChange={onChange}
                  />
                </div>
                <CheckoutField
                  name="expiry"
                  label="Expiry"
                  placeholder="MM/YY"
                  maxLength={5}
                  form={form}
                  errors={errors}
                  onChange={onChange}
                />
                <CheckoutField
                  name="cvc"
                  label="CVC"
                  placeholder="123"
                  maxLength={4}
                  form={form}
                  errors={errors}
                  onChange={onChange}
                />
              </div>
              <p className="mt-3 text-[11px] text-subtle">Demo checkout — no charge is made.</p>
            </div>
          )}
        </section>
      </div>

      <aside className="h-fit border border-line bg-elevated p-6 lg:sticky lg:top-24">
        <h2 className="text-[11px] tracking-[0.22em] uppercase">Order</h2>
        <ul className="mt-5 space-y-3">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3 text-sm">
              <img
                src={coverThumb(i.product, i.color)}
                alt=""
                referrerPolicy="no-referrer"
                className="h-14 w-12 object-cover"
              />
              <div className="flex-1">
                <p>{i.product.name}</p>
                <p className="text-xs text-subtle">
                  {i.color} · ×{i.qty}
                </p>
              </div>
              <p>{formatPrice(i.product.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-subtle">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-subtle">Delivery</dt>
            <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-subtle">Tax</dt>
            <dd>{formatPrice(tax)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" className="mt-6 w-full">
          Place order
        </Button>
        <Link to="/cart" className="mt-3 block text-center text-[11px] tracking-widest text-subtle uppercase">
          Back to bag
        </Link>
      </aside>
    </Container>
  )
}
