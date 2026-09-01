import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import ToastContainer from '../common/ToastContainer'
import SearchOverlay from '../common/SearchOverlay'
import QuickView from '../common/QuickView'
import CompareBar from '../common/CompareBar'
import ErrorBoundary from '../common/ErrorBoundary'
import { useCompare } from '../../context/CompareContext'

export default function Layout() {
  const { pathname } = useLocation()
  const { items: compared } = useCompare()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className={`relative min-h-svh bg-bg text-ink ${compared.length ? 'pb-20' : ''}`}>
      <div className="grain" aria-hidden />
      <div className="border-b border-line bg-muted">
        <p className="px-3 py-2 text-center text-[10px] leading-relaxed tracking-[0.14em] text-subtle uppercase sm:tracking-[0.22em]">
          Complimentary white-glove delivery over $1,200 · Trade program open
        </p>
      </div>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ToastContainer />
      <SearchOverlay />
      <QuickView />
      <CompareBar />
    </div>
  )
}
