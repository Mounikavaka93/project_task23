import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-28 text-center">
      <p className="font-display text-8xl italic text-gold">404</p>
      <h1 className="mt-4 font-display text-4xl italic">This room was never built.</h1>
      <p className="mt-3 text-sm text-subtle">The page does not exist, or the piece has left the atelier.</p>
      <Button to="/" size="lg" className="mt-8">
        Return home
      </Button>
    </div>
  )
}
