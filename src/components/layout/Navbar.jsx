import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Heart, Menu, Moon, Search, ShoppingBag, Sun, User, X } from 'lucide-react'
import { navLinks, categories } from '../../data/categories'
import { useTheme } from '../../context/ThemeContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useUI } from '../../context/UIContext'
import { useLockBody } from '../../hooks/useLockBody'
import { AnimatePresence, motion } from 'framer-motion'

const navClass = ({ isActive }) =>
  `relative text-[11px] tracking-[0.22em] uppercase after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-ink after:transition-all ${
    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
  }`

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { count } = useCart()
  const { count: wish } = useWishlist()
  const { setSearchOpen, mobileNav, setMobileNav } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [roomsOpen, setRoomsOpen] = useState(false)
  const location = useLocation()
  useLockBody(mobileNav)

  useEffect(() => {
    setMobileNav(false)
    setRoomsOpen(false)
  }, [location.pathname, setMobileNav])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition ${
          scrolled
            ? 'border-line bg-bg/90 backdrop-blur-md'
            : 'border-transparent bg-bg'
        }`}
      >
        <div className="flex h-14 w-full items-center justify-between gap-2 px-3 md:h-[4.5rem]">
          <button
            type="button"
            className="lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={22} />
          </button>

          <Link
            to="/"
            className="min-w-0 truncate font-display text-lg tracking-[0.14em] uppercase sm:text-[1.65rem] sm:tracking-[0.28em]"
          >
            Velora
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.slice(0, 2).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/' || l.to === '/shop'}
                className={navClass}
              >
                {l.label}
              </NavLink>
            ))}
            <div
              className="relative"
              onMouseEnter={() => setRoomsOpen(true)}
              onMouseLeave={() => setRoomsOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] tracking-[0.22em] uppercase"
                aria-expanded={roomsOpen}
                onClick={() => setRoomsOpen((v) => !v)}
              >
                Rooms <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {roomsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 z-50 grid w-[320px] grid-cols-2 gap-1 border border-line bg-elevated p-3 shadow-lg"
                  >
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/shop/${c.id}`}
                        className="px-3 py-2 text-sm hover:bg-muted"
                      >
                        <span className="block font-display text-lg italic">{c.name}</span>
                        <span className="text-[10px] tracking-widest text-subtle uppercase">
                          {c.subtitle}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.slice(2).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={navClass}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid h-9 w-9 place-items-center sm:h-10 sm:w-10"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              type="button"
              onClick={toggle}
              className="grid h-9 w-9 place-items-center sm:h-10 sm:w-10"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              <span className="inline-flex transition-transform duration-300">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </span>
            </button>
            <Link to="/login" className="grid h-9 w-9 place-items-center sm:h-10 sm:w-10" aria-label="Account">
              <User size={18} />
            </Link>
            <Link to="/wishlist" className="relative grid h-9 w-9 place-items-center sm:h-10 sm:w-10" aria-label="Wishlist">
              <Heart size={18} />
              {wish > 0 && (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center bg-accent px-0.5 text-[9px] text-white sm:top-1.5 sm:right-1.5">
                  {wish}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative grid h-9 w-9 place-items-center sm:h-10 sm:w-10" aria-label="Bag">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center bg-ink px-0.5 text-[9px] text-elevated sm:top-1.5 sm:right-1.5">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNav && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNav(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[min(100%,320px)] flex-col overflow-y-auto bg-bg p-6 no-scrollbar"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-display text-xl tracking-[0.24em] uppercase">Velora</span>
                <button type="button" onClick={() => setMobileNav(false)} aria-label="Close menu">
                  <X />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="font-display text-3xl italic">
                    {l.label}
                  </Link>
                ))}
              </div>
              <p className="mt-10 text-[10px] tracking-[0.22em] text-subtle uppercase">Rooms</p>
              <div className="mt-3 flex flex-col gap-2">
                {categories.map((c) => (
                  <Link key={c.id} to={`/shop/${c.id}`} className="text-sm capitalize text-subtle">
                    {c.name}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
