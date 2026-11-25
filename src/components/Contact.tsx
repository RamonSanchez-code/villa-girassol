import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { site } from '../data/site'
import { scrollToId, whatsappLink } from '../lib/utils'
import { Logo, Sunflower } from './Logo'

export function Contact() {
  const c = site.contact
  const l = site.location
  return (
    <section id="contato" className="bg-cream-100 py-20 md:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-leaf-700 px-6 py-12 text-cream shadow-lift sm:px-12 md:py-16" data-reveal>
          <Sunflower className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 opacity-15" spin />
          <div className="relative max-w-xl">
            <span className="eyebrow !text-sun-300">Contato</span>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">Vamos conversar sobre o seu evento?</h2>
            <p className="mt-4 text-cream/75">Tire dúvidas, peça valores ou agende uma visita. O atendimento é feito direto com o espaço.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink(`Olá! Vim pelo site do ${site.name} e gostaria de mais informações.`)} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle size={18} /> Falar no WhatsApp
              </a>
              {c.instagram ? (
                <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <Instagram size={18} /> Ver no Instagram
                </a>
              ) : (
                <a href={`tel:${c.phoneTel}`} className="btn-ghost">
                  <Phone size={18} /> Ligar agora
                </a>
              )}
            </div>
          </div>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Item icon={<MessageCircle size={20} />} title="WhatsApp e telefone">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="block font-semibold hover:text-leaf-800 hover:underline">{c.phoneDisplay}</a>
            <a href={`tel:${c.phoneTel}`} className="text-sm font-semibold text-sun-600 hover:underline">Ligar</a>
          </Item>
          <Item icon={<MapPin size={20} />} title="Endereço">
            {l.street && <span className="block">{l.street}</span>}
            <span className="block">{l.city} — {l.state}{l.cep ? `, ${l.cep}` : ''}</span>
            <button onClick={() => scrollToId('localizacao')} className="text-sm font-semibold text-sun-600 hover:underline">Ver no mapa</button>
          </Item>
          <Item icon={<Clock size={20} />} title="Atendimento">
            {site.hours ? (
              site.hours.map((h) => <span key={h.days} className="block"><strong className="font-semibold">{h.days}:</strong> {h.time}</span>)
            ) : (
              <span>{site.hoursNote}</span>
            )}
          </Item>
          {c.instagram && (
            <Item icon={<Instagram size={20} />} title="Instagram">
              <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="block break-all font-semibold hover:text-leaf-800 hover:underline">{c.instagramHandle}</a>
              <span className="text-sm text-ink-mute">Fotos e novidades</span>
            </Item>
          )}
        </ul>
      </div>
    </section>
  )
}

function Item({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="rounded-3xl bg-white p-4 shadow-soft sm:p-6 ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift" data-reveal>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-sun-300/40 text-sun-600">{icon}</span>
      <h3 className="mt-4 font-sans text-sm font-semibold uppercase tracking-wider text-ink-mute">{title}</h3>
      <div className="mt-1 break-words text-sm leading-relaxed text-ink sm:text-[15px]">{children}</div>
    </li>
  )
}

export function Footer() {
  const c = site.contact
  const socials = [
    c.instagram && { href: c.instagram, label: 'Instagram', icon: <Instagram size={18} /> },
    c.facebook && { href: c.facebook, label: 'Facebook', icon: <Facebook size={18} /> },
    c.email && { href: `mailto:${c.email}`, label: 'E-mail', icon: <Mail size={18} /> },
  ].filter(Boolean) as { href: string; label: string; icon: ReactNode }[]

  return (
    <footer className="bg-leaf-900 py-12 text-cream/70">
      <div className="container-x flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <Logo light />
        <p className="text-sm">{site.segment} em {site.location.city}/{site.location.state} · WhatsApp {c.phoneDisplay}</p>
        {socials.length > 0 && (
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun-400 hover:text-ink">{s.icon}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="container-x mt-8 border-t border-white/10 pt-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {site.name}. Solicitações enviadas pelo site estão sujeitas à confirmação do espaço.
      </p>
    </footer>
  )
}
