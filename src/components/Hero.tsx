import { ArrowDown, CalendarDays, MapPin } from 'lucide-react'
import { site } from '../data/site'
import { img, scrollToId, srcSet } from '../lib/utils'
import { Sunflower } from './Logo'

export function Hero() {
  const hero = site.gallery[0]
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-leaf-900 text-white md:items-center">
      <img
        src={img(hero.src, 1600)}
        srcSet={srcSet(hero.src, [800, 1200, 1600, 2200])}
        sizes="100vw"
        alt={hero.alt}
        style={{ objectPosition: hero.focus }}
        {...{ fetchpriority: 'high' }}
        className="absolute inset-x-0 top-0 -z-10 h-[46svh] w-full animate-[fade_1.4s_ease_both] object-cover max-md:!object-top [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] motion-safe:scale-105 motion-safe:animate-[heroZoom_14s_ease-out_both] md:inset-0 md:h-full md:[mask-image:none]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-leaf-900 via-leaf-900/40 to-leaf-900/20 md:bg-gradient-to-r md:from-leaf-900/90 md:via-leaf-900/55 md:to-transparent" />

      <Sunflower className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 opacity-10 md:h-[30rem] md:w-[30rem]" spin />

      <div className="container-x pb-24 pt-28 md:py-32">
        <div className="max-w-2xl">
          {site.badge && (
            <span className="mb-5 inline-flex animate-rise items-center gap-2 rounded-full border border-sun-300/40 bg-white/10 px-3 py-1 text-xs font-semibold text-sun-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sun-300" /> {site.badge}
            </span>
          )}
          <p className="eyebrow animate-rise !text-sun-300">
            <MapPin size={14} /> {site.segment} · {site.location.city}/{site.location.state}
          </p>
          <h1 className="mt-5 animate-rise text-[2.6rem] leading-[1.05] [animation-delay:.12s] sm:text-6xl md:text-7xl">
            {site.name.replace(site.shortName, '')}
            <span className="block text-sun-300">{site.shortName}</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise font-display text-xl italic text-white/90 [animation-delay:.24s] sm:text-2xl">
            {site.headline}
          </p>
          <p className="mt-4 max-w-lg animate-rise text-base leading-relaxed text-white/75 [animation-delay:.34s] sm:text-lg">{site.intro}</p>

          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:.46s] sm:flex-row">
            <button onClick={() => scrollToId('opcoes')} className="btn-primary">
              Conhecer opções
            </button>
            <button onClick={() => scrollToId('reserva')} className="btn-ghost">
              <CalendarDays size={18} /> Consultar disponibilidade
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToId('sobre')}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce rounded-full p-2 text-white/70 hover:text-white md:block"
        aria-label="Rolar para a seção Sobre"
      >
        <ArrowDown size={22} />
      </button>
    </section>
  )
}
