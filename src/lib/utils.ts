import { site } from '../data/site'

const isUnsplash = (src: string) => src.includes('images.unsplash.com')
const isGoogle = (src: string) => src.includes('googleusercontent.com')

/** Gera a URL no tamanho certo (Unsplash e fotos do Google Maps); arquivos locais ficam como estao. */
export const img = (src: string, w = 1200, q = 70) =>
  isUnsplash(src) ? `${src}?auto=format&fit=crop&w=${w}&q=${q}` : isGoogle(src) ? `${src}=w${w}-h${w * 2}-k-no` : src

export const srcSet = (src: string, widths = [480, 800, 1200, 1600]) =>
  isUnsplash(src) || isGoogle(src) ? widths.map((w) => `${img(src, w)} ${w}w`).join(', ') : undefined

export const formatPrice = (price: number | null, unit?: string) =>
  price == null
    ? 'Sob consulta'
    : `${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}${unit ? ` ${unit}` : ''}`

export const pad = (n: number) => String(n).padStart(2, '0')
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const formatDateLong = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })

export const formatDateShort = (d: Date) =>
  d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '')

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const directionsLink = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${site.location.lat},${site.location.lng}`

export const scrollToId = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
