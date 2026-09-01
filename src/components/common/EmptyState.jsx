import Button from '../ui/Button'

export default function EmptyState({ icon: Icon, title, body, action, to }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      {Icon && <Icon className="mb-5 text-gold" size={36} strokeWidth={1.25} />}
      <h2 className="font-display text-3xl font-medium italic">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-subtle">{body}</p>
      {action && to && (
        <Button to={to} className="mt-8">
          {action}
        </Button>
      )}
    </div>
  )
}
