import { useEffect, useState } from 'react'

const PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="#e8e0d2" width="400" height="500"/><text x="50%" y="50%" fill="#6b6258" font-size="14" text-anchor="middle" font-family="Georgia">VELORA</text></svg>`
  )

function srcSetFor(src) {
  if (!src?.includes('images.unsplash.com')) return undefined
  const base = src.split('?')[0]
  return [480, 800, 1200]
    .map((w) => `${base}?auto=format&fit=crop&w=${w}&q=75 ${w}w`)
    .join(', ')
}

export default function LazyImage({
  src,
  alt,
  className = '',
  imgClass = '',
  eager = false,
  sizes = '(max-width: 768px) 50vw, 25vw',
}) {
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(src)

  useEffect(() => {
    setLoaded(false)
    setCurrent(src)
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-muted ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0 z-[1]" />}
      <img
        src={current}
        srcSet={current === src ? srcSetFor(src) : undefined}
        sizes={sizes}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setCurrent(PLACEHOLDER)
          setLoaded(true)
        }}
        ref={(node) => {
          if (node?.complete && node.naturalWidth > 0) setLoaded(true)
        }}
        className={`h-full w-full object-cover transition duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClass}`}
      />
    </div>
  )
}
