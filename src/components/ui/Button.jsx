import { Link } from 'react-router-dom'

const variants = {
  primary:
    'border border-ink bg-ink text-elevated hover:border-accent hover:bg-accent',
  outline:
    'border border-ink bg-transparent text-ink hover:bg-ink hover:text-elevated',
  ghost: 'border border-transparent text-subtle hover:text-ink',
}

const sizes = {
  sm: 'px-4 py-2 text-[10px] tracking-[0.16em]',
  md: 'px-6 py-3 text-[11px] tracking-[0.2em]',
  lg: 'px-7 py-3.5 text-[11px] tracking-[0.22em]',
}

export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  type,
  children,
  ...props
}) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 uppercase disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type || 'button'} className={classes} {...props}>
      {children}
    </button>
  )
}
