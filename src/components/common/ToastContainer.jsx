import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { useCompare } from '../../context/CompareContext'

const icons = {
  success: CheckCircle2,
  error: CircleAlert,
  info: Info,
}

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()
  const { items } = useCompare()

  return (
    <div
      className={`pointer-events-none fixed z-[90] flex w-[min(100%-2rem,360px)] flex-col gap-2 ${
        items.length ? 'bottom-24' : 'bottom-6'
      } right-4 left-4 sm:right-6 sm:left-auto`}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.28 }}
              className="pointer-events-auto flex items-start gap-3 border border-line bg-elevated px-4 py-3 shadow-lg"
            >
              <Icon
                size={18}
                className={
                  t.type === 'error'
                    ? 'mt-0.5 text-danger'
                    : t.type === 'success'
                      ? 'mt-0.5 text-success'
                      : 'mt-0.5 text-gold'
                }
              />
              <p className="flex-1 text-sm leading-snug text-ink">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="text-subtle hover:text-ink"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
