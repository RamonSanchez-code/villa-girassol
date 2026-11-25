import { BedDouble, Car, Flame, Waves } from 'lucide-react'
import { site } from '../data/site'
import { img, srcSet } from '../lib/utils'
import { IllustrativeTag } from './IllustrativeTag'

const icons = { pool: Waves, grill: Flame, bed: BedDouble, car: Car } as const

export function About() {
  const a = site.gallery[1]
  const b = site.gallery[0]
  return (
    <section id="sobre" className="relative py-20 md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-2 lg:order-1" data-reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift sm:aspect-[5/5] lg:aspect-[4/5]">
            <img src={img(a.src, 900)} srcSet={srcSet(a.src, [480, 800, 1100])} sizes="(min-width:1024px) 45vw, 100vw" alt={a.alt} loading="lazy" style={{ objectPosition: a.focus }} className="h-full w-full object-cover" />
            {a.illustrative && <IllustrativeTag className="left-4 top-4" />}
          </div>
          <div className="absolute -bottom-8 -right-2 w-[46%] overflow-hidden rounded-3xl border-[6px] border-cream shadow-lift sm:-right-6" data-reveal style={{ ['--d' as string]: '150ms' }}>
            <img src={img(b.src, 500)} alt={b.alt} loading="lazy" style={{ objectPosition: b.focus }} className="aspect-square w-full object-cover" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="eyebrow" data-reveal>Sobre o espaço</span>
          <h2 className="section-title" data-reveal>{site.about.title}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft" data-reveal>
            {site.about.text.map((p) => <p key={p}>{p}</p>)}
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
            {site.about.highlights.map((h, i) => {
              const Icon = icons[h.icon as keyof typeof icons]
              return (
                <li key={h.title} className="group rounded-2xl bg-white p-4 shadow-soft sm:p-5 ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift" data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-sun-300/30 text-sun-600 transition group-hover:rotate-6 group-hover:bg-sun-400 group-hover:text-ink">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-sans text-base font-semibold text-leaf-800">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">{h.text}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
