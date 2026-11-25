import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { site } from '../data/site'
import { img, srcSet } from '../lib/utils'
import { IllustrativeTag } from './IllustrativeTag'

// Mosaico: classes de tamanho por posição (repete o padrão)
const spans = ['col-span-2 md:row-span-2', '', 'md:row-span-2', '', '', 'col-span-2 md:col-span-1', '', '']

export function Gallery() {
  const photos = site.gallery
  const [index, setIndex] = useState<number | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)

  const open = (i: number) => {
    lastFocus.current = document.activeElement as HTMLElement
    setIndex(i)
  }
  const close = useCallback(() => {
    setIndex(null)
    lastFocus.current?.focus()
  }, [])
  const step = useCallback((d: number) => setIndex((i) => (i == null ? i : (i + d + photos.length) % photos.length)), [photos.length])

  useEffect(() => {
    if (index == null) return
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [index, close, step])

  const current = index != null ? photos[index] : null

  return (
    <section id="galeria" className="bg-cream-100 py-20 md:py-32">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="eyebrow" data-reveal>Galeria</span>
            <h2 className="section-title" data-reveal>Inspire-se para o seu dia</h2>
          </div>
          <p className="max-w-sm text-ink-soft" data-reveal>Toque em uma foto para ampliar e navegar pelas imagens.</p>
        </div>

        <ul className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4 md:gap-4">
          {photos.map((p, i) => (
            <li key={p.src + i} className={`${spans[i % spans.length]}`} data-reveal style={{ ['--d' as string]: `${(i % 4) * 70}ms` }}>
              <button
                onClick={() => open(i)}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-cream-200 md:rounded-3xl"
                aria-label={`Ampliar foto: ${p.alt}`}
              >
                <img
                  src={img(p.src, 800)}
                  srcSet={srcSet(p.src, [400, 800, 1200])}
                  sizes="(min-width:768px) 50vw, 100vw"
                  alt={p.alt}
                  loading="lazy"
                  style={{ objectPosition: p.focus }}
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-white/90 text-leaf-800 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <Expand size={16} />
                </span>
                {p.illustrative && <IllustrativeTag className="left-2 top-2 !text-[9px]" />}
              </button>
            </li>
          ))}
        </ul>
        {photos.some((p) => p.illustrative) && (
          <p className="mt-5 text-center text-xs text-ink-mute">Fotos marcadas como ilustrativas serão substituídas por fotos do espaço.</p>
        )}
      </div>

      {current && index != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${index + 1} de ${photos.length}: ${current.alt}`}
          className="fixed inset-0 z-[60] flex animate-fade flex-col bg-leaf-900/95 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current == null) return
            const dx = e.changedTouches[0].clientX - touchX.current
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
            touchX.current = null
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80 sm:px-6">
            <span className="text-sm tabular-nums">{index + 1} / {photos.length}</span>
            <button ref={closeBtn} onClick={close} className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/10" aria-label="Fechar galeria">
              <X size={24} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
            <img key={index} src={img(current.src, 1600, 80)} alt={current.alt} className="max-h-full max-w-full animate-pop rounded-xl object-contain shadow-2xl" />
            <button onClick={() => step(-1)} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-5" aria-label="Foto anterior">
              <ChevronLeft size={26} />
            </button>
            <button onClick={() => step(1)} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-5" aria-label="Próxima foto">
              <ChevronRight size={26} />
            </button>
          </div>

          <p className="px-4 pb-2 pt-3 text-center text-sm text-white/80">
            {current.alt}
            {current.illustrative && <span className="ml-2 text-white/50">· imagem ilustrativa</span>}
          </p>
          <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5 pt-2">
            {photos.map((p, i) => (
              <button key={p.src + i} onClick={() => setIndex(i)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg transition ${i === index ? 'ring-2 ring-sun-400' : 'opacity-50 hover:opacity-90'}`} aria-label={`Ver foto ${i + 1}`} aria-current={i === index}>
                <img src={img(p.src, 120)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
