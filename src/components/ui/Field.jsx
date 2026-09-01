export default function Field({
  name,
  label,
  value,
  error,
  onChange,
  className = '',
  inputClassName = '',
  children,
  ...rest
}) {
  const invalid = Boolean(error)

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={name} className="block text-[10px] tracking-[0.18em] uppercase">
          {label}
        </label>
      ) : null}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={invalid || undefined}
        className={`mt-2 h-12 w-full border bg-transparent px-3 text-sm outline-none ${
          invalid ? 'border-danger' : 'border-line focus:border-ink'
        } ${inputClassName}`}
        {...rest}
      />
      {children}
      {invalid ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
