import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { passwordRules, validateSignup } from '../utils/validation'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'

export default function Signup() {
  const { signup, user } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const rules = passwordRules(form.password)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  const submit = (e) => {
    e.preventDefault()
    const next = validateSignup(form)
    setErrors(next)
    if (Object.keys(next).length) {
      push('Please fix the highlighted fields', 'error')
      return
    }
    const res = signup(form)
    if (!res.ok) {
      push(res.error, 'error')
      return
    }
    push('Account created. Welcome to VELORA.')
    navigate('/')
  }

  if (user) return <Navigate to="/login" replace />

  return (
    <AuthLayout
      reverse
      image="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    >
      <form onSubmit={submit} className="w-full max-w-md" noValidate>
        <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Account</p>
        <h1 className="mt-2 font-display text-5xl italic">Begin</h1>
        <p className="mt-3 text-sm text-subtle">One account for orders, wishlist, and the atelier letter.</p>

        <Field
          name="name"
          label="Full name"
          autoComplete="name"
          value={form.name}
          error={errors.name}
          onChange={onChange}
          className="mt-8"
        />
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={onChange}
          className="mt-5"
        />
        <Field
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={onChange}
          className="mt-5"
        >
          <ul className="mt-2 space-y-1 text-[11px] text-subtle">
            <li className={rules.length ? 'text-success' : ''}>8+ characters</li>
            <li className={rules.upper ? 'text-success' : ''}>One uppercase letter</li>
            <li className={rules.number ? 'text-success' : ''}>One number</li>
          </ul>
        </Field>
        <Field
          name="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          error={errors.confirm}
          onChange={onChange}
          className="mt-5"
        />
        <Button type="submit" size="lg" className="mt-8 w-full">
          Create account
        </Button>
        <p className="mt-6 text-sm text-subtle">
          Already with us?{' '}
          <Link to="/login" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
