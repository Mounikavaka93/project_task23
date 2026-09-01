import { Link } from 'react-router-dom'
import { categories } from '../../data/categories'
import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-[0.16em] uppercase sm:text-3xl sm:tracking-[0.24em]">Velora</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-subtle">
            Rooms composed, not furnished. A furniture atelier for people who notice the grain,
            the weight of a chair, and the quiet of a well-made lamp.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-subtle uppercase">Collection</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/shop/${c.id}`} className="hover:text-accent">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.22em] text-subtle uppercase">Atelier</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/shop" className="hover:text-accent">
                Shop all
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-accent">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-accent">
                Account
              </Link>
            </li>
            <li>
              <Link to="/compare" className="hover:text-accent">
                Compare
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-5 text-[11px] text-subtle sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} VELORA Atelier. Crafted for living.</p>
          <p>Complimentary white-glove delivery on orders over $1,200.</p>
        </Container>
      </div>
    </footer>
  )
}
