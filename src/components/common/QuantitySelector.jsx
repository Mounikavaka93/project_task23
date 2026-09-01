import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        aria-label="Decrease"
        className="grid h-10 w-10 place-items-center text-subtle hover:text-ink disabled:opacity-30 sm:h-11 sm:w-11"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        className="grid h-10 w-10 place-items-center text-subtle hover:text-ink disabled:opacity-30 sm:h-11 sm:w-11"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
