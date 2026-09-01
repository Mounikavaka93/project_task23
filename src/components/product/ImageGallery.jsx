import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LazyImage from '../common/LazyImage'

export default function ImageGallery({ images, name }) {
  const [i, setI] = useState(0)

  return (
    <div className="grid gap-3 md:grid-cols-[72px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto no-scrollbar md:order-1 md:flex-col">
        {images.map((src, idx) => (
          <button
            key={`${src}-${idx}`}
            type="button"
            onClick={() => setI(idx)}
            className={`h-16 w-16 shrink-0 overflow-hidden border ${
              i === idx ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={src} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-muted md:order-2">
        <LazyImage
          src={images[i] || images[0]}
          alt={name}
          className="h-full w-full"
          sizes="(max-width: 768px) 100vw, 50vw"
          eager
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => setI((n) => (n === 0 ? images.length - 1 : n - 1))}
              className="absolute top-1/2 left-3 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center bg-elevated/80"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => setI((n) => (n === images.length - 1 ? 0 : n + 1))}
              className="absolute top-1/2 right-3 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center bg-elevated/80"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
