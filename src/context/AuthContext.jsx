import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('velora-user', null)
  const [users, setUsers] = useLocalStorage('velora-users', [])

  const signup = ({ name, email, password }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return { ok: false, error: 'An account with this email already exists' }
    const next = { name: name.trim(), email: email.trim().toLowerCase(), password }
    setUsers((prev) => [...prev, next])
    setUser({ name: next.name, email: next.email })
    return { ok: true }
  }

  const login = ({ email, password }) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { ok: false, error: 'Invalid email or password' }
    setUser({ name: found.name, email: found.email })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
