export default function CoverPicker({ colors, value, onChange, label = 'Choose colour' }) {
  const selected = colors.find((c) => c.name === value) || colors[0]

  return (
    <fieldset className="mt-8 border-0 p-0">
      <legend className="text-[10px] tracking-[0.2em] text-subtle uppercase">{label}</legend>
      <p className="mt-1 text-sm">{selected?.name}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {colors.map((c) => {
          const active = c.name === selected?.name
          const thumb = c.images?.[0]
          return (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={c.name}
              aria-pressed={active}
              onClick={() => onChange(c.name)}
              className={`h-16 w-16 overflow-hidden bg-muted ${
                active ? 'outline outline-2 outline-ink outline-offset-2' : 'outline outline-1 outline-line outline-offset-2'
              }`}
            >
              {thumb ? (
                <img src={thumb} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              ) : (
                <span className="block h-full w-full" style={{ background: c.hex }} />
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
