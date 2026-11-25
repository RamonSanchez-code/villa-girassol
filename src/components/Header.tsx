import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { scrollToId } from '../lib/utils'

const links = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'opcoes', label: 'Opções' },
  { id: 'reserva', label: 'Datas' },
  { id: 'localizacao', label: 'Localização' },
  { id: 'contato', label: 'Contato' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      if (window.scrollY < window.innerHeight * 0.5) setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.getElementById(l.id)
      if (el) io.observe(el)
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        solid ? 'bg-cream/90 shadow-[0_1px_0_rgba(42,38,32,.06)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20" aria-label="Navegação principal">
        <a href="#inicio" onClick={(e) => { e.preventDefault(); go('inicio') }} aria-label="Espaço Villa Girassol — início">
          <Logo light={!solid} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id) }}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  solid ? 'text-ink-soft hover:text-leaf-800' : 'text-white/85 hover:text-white'
                } ${active === l.id ? (solid ? '!text-leaf-800' : '!text-white') : ''}`}
                aria-current={active === l.id ? 'true' : undefined}
              >
                {l.label}
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-sun-400 transition-transform duration-300 ${
                    active === l.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button onClick={() => go('reserva')} className="btn-primary hidden !min-h-[42px] !px-5 text-sm sm:inline-flex">
            Consultar datas
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className={`grid h-11 w-11 place-items-center rounded-full transition lg:hidden ${solid ? 'text-leaf-800 hover:bg-ink/5' : 'text-white hover:bg-white/10'}`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`overflow-hidden border-t border-ink/5 bg-cream transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-[80vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="container-x flex flex-col py-3">
          {links.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: open ? `${i * 40}ms` : '0ms' }} className={`transition duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}>
              <a
                href={`#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id) }}
                className="flex min-h-[52px] items-center justify-between border-b border-ink/5 font-display text-xl text-leaf-800"
                tabIndex={open ? 0 : -1}
              >
                {l.label}
                <span className="text-sun-500">→</span>
              </a>
            </li>
          ))}
          <li className="pt-4">
            <button onClick={() => go('reserva')} className="btn-primary w-full" tabIndex={open ? 0 : -1}>
              Consultar disponibilidade
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
