import { Check, Clock, Info, MessageCircle, Users } from 'lucide-react'
import { site } from '../data/site'
import { formatPrice, img, srcSet, whatsappLink } from '../lib/utils'
import { IllustrativeTag } from './IllustrativeTag'

type Props = { selectedId: string | null; onSelect: (id: string) => void }

export function Options({ selectedId, onSelect }: Props) {
  return (
    <section id="opcoes" className="py-20 md:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow" data-reveal>Opções e valores</span>
          <h2 className="section-title" data-reveal>Para cada celebração, um jeito de receber</h2>
          <p className="mt-4 text-ink-soft" data-reveal>
            Escolha o tipo de evento e siga para o calendário. Os valores são informados diretamente pelo espaço, conforme data, duração e número de convidados.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.options.map((o, i) => {
            const selected = selectedId === o.id
            return (
              <li key={o.id} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
                <article
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 transition duration-500 hover:-translate-y-1.5 hover:shadow-lift ${
                    selected ? 'ring-2 ring-sun-500' : 'ring-ink/5'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={img(o.image.src, 700)} srcSet={srcSet(o.image.src, [400, 700, 1000])} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" alt={o.image.alt} loading="lazy" style={{ objectPosition: o.image.focus }} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    {o.image.illustrative && <IllustrativeTag className="bottom-3 left-3" />}
                    {selected && (
                      <span className="absolute right-3 top-3 inline-flex animate-pop items-center gap-1 rounded-full bg-sun-400 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
                        <Check size={14} /> Selecionada
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-sun-600">{o.tagline}</p>
                    <h3 className="mt-1.5 text-2xl text-leaf-800">{o.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.description}</p>

                    <ul className="mt-4 space-y-2 text-sm text-ink">
                      {o.features.map((f) => (
                        <li key={f} className="flex gap-2">
                          <Check size={16} className="mt-0.5 shrink-0 text-leaf-600" /> {f}
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-cream p-3 text-sm">
                      <div>
                        <dt className="flex items-center gap-1 text-xs text-ink-mute"><Users size={13} /> Convidados</dt>
                        <dd className={o.capacity ? 'font-semibold text-ink' : 'pending'}>{o.capacity ? `até ${o.capacity}` : 'A confirmar'}</dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1 text-xs text-ink-mute"><Clock size={13} /> Duração</dt>
                        <dd className={o.duration ? 'font-semibold text-ink' : 'pending'}>{o.duration ?? 'A confirmar'}</dd>
                      </div>
                    </dl>

                    <div className="mt-auto pt-5">
                      <p className="text-xs text-ink-mute">Valor</p>
                      <p className="font-display text-2xl text-leaf-800">{formatPrice(o.price, o.priceUnit)}</p>
                      <p className="mt-2 flex gap-1.5 text-xs leading-relaxed text-ink-mute">
                        <Info size={14} className="mt-px shrink-0" /> {o.notes}
                      </p>

                      <div className="mt-5 flex flex-col gap-2">
                        <button onClick={() => onSelect(o.id)} className={selected ? 'btn-dark' : 'btn-primary'} aria-pressed={selected}>
                          {selected ? <><Check size={18} /> Opção selecionada</> : 'Selecionar opção'}
                        </button>
                        {o.price == null && (
                          <a
                            href={whatsappLink(`Olá! Gostaria de receber informações e valores sobre a opção "${o.name}" do ${site.name}.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline !min-h-[44px] text-sm"
                          >
                            <MessageCircle size={16} /> Solicitar valores
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
