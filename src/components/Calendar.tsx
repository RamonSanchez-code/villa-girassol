import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { site } from '../data/site'
import { startOfDay, toISO } from '../lib/utils'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const WEEKDAYS_FULL = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export type DayStatus = 'past' | 'soon' | 'unavailable' | 'available'

/** Regras de disponibilidade — trocar por consulta à API quando houver sistema de reservas. */
export function getDayStatus(d: Date, today = startOfDay(new Date())): DayStatus {
  const { closedWeekdays, unavailableDates, minAdvanceDays, firstDate } = site.booking
  if (d < today) return 'past'
  if (firstDate && toISO(d) < firstDate) return 'unavailable'
  if (closedWeekdays.includes(d.getDay()) || unavailableDates.includes(toISO(d))) return 'unavailable'
  const min = new Date(today)
  min.setDate(min.getDate() + minAdvanceDays)
  if (d < min) return 'soon'
  return 'available'
}

type Props = {
  /** Datas selecionadas (ordenadas) */
  value: Date[]
  onChange: (dates: Date[]) => void
  /** true = cada clique adiciona/remove um dia; false = escolhe um único dia */
  multiple?: boolean
  invalid?: boolean
}

export function Calendar({ value, onChange, multiple = false, invalid }: Props) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const first = value[0] ?? null
  const selectedISOs = new Set(value.map(toISO))
  const [view, setView] = useState(() => new Date((first ?? today).getFullYear(), (first ?? today).getMonth(), 1))
  const [focusISO, setFocusISO] = useState<string>(() => toISO(first ?? today))

  const pick = (d: Date) => {
    const iso = toISO(d)
    if (!multiple) return onChange([d])
    const next = selectedISOs.has(iso) ? value.filter((v) => toISO(v) !== iso) : [...value, d]
    onChange(next.sort((a, b) => a.getTime() - b.getTime()))
  }
  const [dir, setDir] = useState<1 | -1>(1)
  const gridRef = useRef<HTMLDivElement>(null)

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + site.booking.monthsAhead, 1)
  const canPrev = view > minMonth
  const canNext = view < maxMonth

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = Array(first.getDay()).fill(null)
    for (let i = 1; i <= count; i++) cells.push(new Date(view.getFullYear(), view.getMonth(), i))
    while (cells.length % 7) cells.push(null)
    return cells
  }, [view])

  const goMonth = (delta: number) => {
    const next = new Date(view.getFullYear(), view.getMonth() + delta, 1)
    if (next < minMonth || next > maxMonth) return
    setDir(delta > 0 ? 1 : -1)
    setView(next)
    return next
  }

  const focusDay = (d: Date) => {
    const m = new Date(d.getFullYear(), d.getMonth(), 1)
    if (m < minMonth || m > maxMonth) return
    if (m.getTime() !== view.getTime()) {
      setDir(m > view ? 1 : -1)
      setView(m)
    }
    const iso = toISO(d)
    setFocusISO(iso)
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`)?.focus())
  }

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, d: Date) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (e.key in map) {
      e.preventDefault()
      const n = new Date(d)
      n.setDate(n.getDate() + map[e.key])
      focusDay(n)
    } else if (e.key === 'PageUp' || e.key === 'PageDown') {
      e.preventDefault()
      const n = new Date(d)
      n.setMonth(n.getMonth() + (e.key === 'PageDown' ? 1 : -1))
      focusDay(n)
    }
  }

  // garante que exista um dia focável (roving tabindex) no mês visível
  const visibleISOs = days.filter(Boolean).map((d) => toISO(d!))
  const tabbableISO = visibleISOs.includes(focusISO)
    ? focusISO
    : visibleISOs.find((iso) => selectedISOs.has(iso))
      ? visibleISOs.find((iso) => selectedISOs.has(iso))!
      : visibleISOs.find((iso) => getDayStatus(new Date(iso + 'T00:00'), today) === 'available') ?? visibleISOs[0]

  const monthName = view.toLocaleDateString('pt-BR', { month: 'long' })
  const monthLabel = `${monthName[0].toUpperCase()}${monthName.slice(1)} de ${view.getFullYear()}`

  return (
    <div className={`rounded-3xl border bg-white p-4 sm:p-6 ${invalid ? 'border-red-400' : 'border-ink/10'}`}>
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => goMonth(-1)} disabled={!canPrev} className="grid h-11 w-11 place-items-center rounded-full text-leaf-800 transition hover:bg-cream-100 disabled:opacity-25" aria-label="Mês anterior">
          <ChevronLeft size={22} />
        </button>
        <h3 className="font-display text-xl text-leaf-800" aria-live="polite">{monthLabel}</h3>
        <button type="button" onClick={() => goMonth(1)} disabled={!canNext} className="grid h-11 w-11 place-items-center rounded-full text-leaf-800 transition hover:bg-cream-100 disabled:opacity-25" aria-label="Próximo mês">
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wider text-ink-mute" aria-hidden="true">
        {WEEKDAYS.map((w) => <span key={w} className="py-1">{w}</span>)}
      </div>

      <div
        ref={gridRef}
        key={view.toISOString()}
        role="group"
        aria-label={`Calendário de ${monthLabel}`}
        className={`mt-1 grid grid-cols-7 gap-1 sm:gap-1.5 ${dir > 0 ? 'animate-[calIn_.35s_ease_both]' : 'animate-[calInRev_.35s_ease_both]'}`}
      >
        {days.map((d, i) => {
          if (!d) return <span key={i} aria-hidden="true" />
          const status = getDayStatus(d, today)
          const iso = toISO(d)
          const selected = selectedISOs.has(iso)
          const isToday = iso === toISO(today)
          const disabled = status !== 'available'
          const statusLabel = { past: 'data passada', soon: 'antecedência mínima', unavailable: 'indisponível', available: 'disponível' }[status]
          return (
            <button
              key={iso}
              type="button"
              data-iso={iso}
              tabIndex={iso === tabbableISO ? 0 : -1}
              aria-disabled={disabled}
              aria-pressed={!!selected}
              aria-label={`${WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()} de ${d.toLocaleDateString('pt-BR', { month: 'long' })} — ${selected ? 'selecionado' : statusLabel}`}
              onClick={() => { if (!disabled) { setFocusISO(iso); pick(d) } }}
              onKeyDown={(e) => onKey(e, d)}
              onFocus={() => setFocusISO(iso)}
              className={[
                'relative grid h-11 place-items-center sm:h-12 rounded-xl text-[15px] font-medium transition duration-200',
                selected
                  ? 'scale-105 bg-leaf-700 text-cream shadow-soft'
                  : status === 'available'
                    ? 'bg-sun-300/20 text-leaf-800 hover:-translate-y-0.5 hover:bg-sun-300/60'
                    : status === 'unavailable'
                      ? 'cursor-not-allowed bg-red-50 text-red-300 line-through'
                      : 'cursor-not-allowed text-ink/25',
              ].join(' ')}
            >
              {d.getDate()}
              {isToday && <span className={`absolute bottom-1 h-1 w-1 rounded-full ${selected ? 'bg-cream' : 'bg-sun-500'}`} aria-hidden="true" />}
            </button>
          )
        })}
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft" aria-label="Legenda do calendário">
        <li className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-sun-300/40" /> Disponível para solicitar</li>
        <li className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-leaf-700" /> Selecionado</li>
        <li className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded bg-red-100" /> Indisponível</li>
        <li className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded border border-ink/10" /> Passado / sem antecedência</li>
      </ul>
    </div>
  )
}
