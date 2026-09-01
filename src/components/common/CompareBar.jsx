import { GitCompareArrows, X } from 'lucide-react'
import { useCompare } from '../../context/CompareContext'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CompareBar() {
  const { items, remove, clear } = useCompare()

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-elevated/95 backdrop-blur-md"
        >
          <div className="flex w-full items-center gap-3 px-3 py-3 md:gap-4">
            <p className="hidden text-[10px] tracking-[0.22em] text-subtle uppercase sm:block">
              Compare {items.length}/3
            </p>
            <div className="flex flex-1 gap-3 overflow-x-auto no-scrollbar">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="relative flex shrink-0 items-center gap-2 border border-line pr-7 pl-1"
                >
                  <img src={p.images[0]} alt="" referrerPolicy="no-referrer" className="h-10 w-10 object-cover" loading="lazy" />
                  <span className="max-w-[120px] truncate text-xs">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    className="absolute top-1 right-1 text-subtle hover:text-ink"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <Button to="/compare" size="sm">
              <GitCompareArrows size={14} /> View
            </Button>
            <button
              type="button"
              onClick={clear}
              className="text-[10px] tracking-widest text-subtle uppercase hover:text-ink"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
