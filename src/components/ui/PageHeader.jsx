export default function PageHeader({ eyebrow, title, subtitle, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}>
      <div>
        {eyebrow ? (
          <p className="text-[10px] tracking-[0.28em] text-accent uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl italic md:text-6xl">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-subtle">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  )
}
