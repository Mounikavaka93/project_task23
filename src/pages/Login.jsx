import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateLogin } from '../utils/validation'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'

export default function Login() {
  const { login, user, logout } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const onChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  const submit = (e) => {
    e.preventDefault()
    const next = validateLogin(form)
    setErrors(next)
    if (Object.keys(next).length) {
      push('Please fix the highlighted fields', 'error')
      return
    }
    const res = login(form)
    if (!res.ok) {
      push(res.error, 'error')
      return
    }
    push('Welcome back')
    navigate(from)
  }

  if (user) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Account</p>
        <h1 className="mt-3 font-display text-5xl italic">Hello, {user.name.split(' ')[0]}.</h1>
        <p className="mt-3 text-sm text-subtle">{user.email}</p>
        <div className="mt-10 flex justify-center gap-3">
          <Button to="/shop">Collection</Button>
          <Button
            variant="outline"
            onClick={() => {
              logout()
              push('Signed out', 'info')
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80">
      <form onSubmit={submit} className="w-full max-w-md" noValidate>
        <p className="text-[10px] tracking-[0.28em] text-accent uppercase">Account</p>
        <h1 className="mt-2 font-display text-5xl italic">Return</h1>
        <p className="mt-3 text-sm text-subtle">Sign in to checkout, wishlist, and order notes.</p>
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={onChange}
          className="mt-8"
        />
        <Field
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          error={errors.password}
          onChange={onChange}
          className="mt-5"
        />
        <Button type="submit" size="lg" className="mt-8 w-full">
          Sign in
        </Button>
        <p className="mt-6 text-sm text-subtle">
          New to the atelier?{' '}
          <Link to="/signup" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
