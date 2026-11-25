import { ExternalLink, MapPin, Navigation } from 'lucide-react'
import { site } from '../data/site'
import { directionsLink } from '../lib/utils'

export function Location() {
  const l = site.location
  const embed = `https://maps.google.com/maps?q=${l.lat},${l.lng}&z=15&hl=pt-BR&output=embed`
  return (
    <section id="localizacao" className="py-20 md:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <span className="eyebrow" data-reveal>Localização</span>
          <h2 className="section-title" data-reveal>Pertinho, e longe da correria</h2>
          <div className="mt-8 flex gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink/5" data-reveal>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun-300/40 text-sun-600"><MapPin size={22} /></span>
            <address className="not-italic leading-relaxed">
              {l.street ? <span className="block font-semibold text-ink">{l.street}</span> : <span className="pending block">Endereço completo a confirmar</span>}
              <span className="block font-semibold text-leaf-800">{l.city} — {l.state}{l.cep ? `, ${l.cep}` : ''}</span>
              <span className="block text-sm text-ink-mute">Plus Code: {l.plusCode}</span>
            </address>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row" data-reveal>
            <a href={directionsLink()} target="_blank" rel="noopener noreferrer" className="btn-dark">
              <Navigation size={18} /> Como chegar
            </a>
            <a href={l.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <ExternalLink size={18} /> Abrir no Google Maps
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-ink/5" data-reveal style={{ ['--d' as string]: '120ms' }}>
          <iframe
            title={`Mapa: localização do ${site.name} em ${l.city}/${l.state}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[340px] w-full border-0 sm:h-[440px]"
          />
        </div>
      </div>
    </section>
  )
}
