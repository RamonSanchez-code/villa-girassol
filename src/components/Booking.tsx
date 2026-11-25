import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { AlertCircle, X, CalendarDays, CheckCircle2, ChevronDown, Clock, MessageCircle, PartyPopper, Sparkles, Users, Wallet, User, NotebookPen } from 'lucide-react'
import { site } from '../data/site'
import { formatDateLong, formatDateShort, formatPrice, whatsappLink } from '../lib/utils'
import { Calendar } from './Calendar'

type Props = {
  selectedId: string | null
  onSelect: (id: string) => void
  notify: (msg: string) => void
}

type Errors = Partial<Record<'date' | 'period' | 'option' | 'name' | 'guests', string>>

export function Booking({ selectedId, onSelect, notify }: Props) {
  const [dates, setDates] = useState<Date[]>([])
  const [multiDay, setMultiDay] = useState(false)
  const [period, setPeriod] = useState<string>('')
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const option = site.options.find((o) => o.id === selectedId) ?? null
  const periodObj = site.booking.periods.find((p) => p.id === period) ?? null

  // ao trocar algo depois de enviar, volta ao estado de edição
  useEffect(() => setSent(false), [dates, period, name, guests, notes, selectedId])

  const switchMode = (multi: boolean) => {
    setMultiDay(multi)
    // ao voltar para um único dia, mantém só a primeira data escolhida
    if (!multi && dates.length > 1) setDates(dates.slice(0, 1))
    clearError('date')
  }

  const datesText = dates.length > 1 ? `${dates.length} dias` : ''

  const message = useMemo(() => {
    const lines = [
      `Olá! Gostaria de consultar a disponibilidade do ${site.name}.`,
      '',
      ...(name.trim() ? [`Nome: ${name.trim()}`] : []),
      `Opção selecionada: ${option?.name ?? '—'}`,
      ...(dates.length > 1
        ? [`Datas desejadas (${dates.length} dias):`, ...dates.map((d) => `• ${formatDateLong(d)}`)]
        : [`Data desejada: ${dates[0] ? formatDateLong(dates[0]) : '—'}`]),
      `Período: ${periodObj ? `${periodObj.label} (${periodObj.hint.toLowerCase()})` : '—'}`,
      `Quantidade de convidados: ${guests || '—'}`,
      `Valor apresentado: ${option ? formatPrice(option.price, option.priceUnit) : '—'}`,
      `Observações: ${notes.trim() || 'Nenhuma'}`,
      '',
      'Gostaria de confirmar a disponibilidade e receber mais informações. Obrigado!',
    ]
    return lines.join('\n')
  }, [name, option, dates, periodObj, guests, notes])

  const validate = (): Errors => {
    const e: Errors = {}
    if (!option) e.option = 'Escolha o tipo de evento.'
    if (!dates.length) e.date = multiDay ? 'Selecione os dias do evento no calendário.' : 'Selecione uma data no calendário.'
    else if (multiDay && dates.length < 2) e.date = 'Selecione pelo menos dois dias, ou escolha "Um dia".'
    if (!period) e.period = 'Escolha o período do evento.'
    if (name.trim().length < 2) e.name = 'Informe seu nome.'
    const g = Number(guests)
    if (!guests || !Number.isInteger(g) || g < 1) e.guests = 'Informe um número válido de convidados.'
    else if (option?.capacity && g > option.capacity) e.guests = `Esta opção comporta até ${option.capacity} convidados.`
    else if (g > 5000) e.guests = 'Verifique a quantidade informada.'
    return e
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const firstKey = (['option', 'date', 'period', 'name', 'guests'] as const).find((k) => e[k])
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstKey}"]`)?.focus()
      notify('Confira os campos destacados para continuar.')
      return
    }
    const url = whatsappLink(message)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) window.location.href = url
    setSent(true)
    notify('Mensagem pronta! Confirme o envio no WhatsApp.')
  }

  const clearError = (k: keyof Errors) => errors[k] && setErrors((e) => ({ ...e, [k]: undefined }))

  const steps = [!!option, multiDay ? dates.length > 1 : dates.length > 0, !!period, name.trim().length > 1 && !!guests]
  const progress = steps.filter(Boolean).length

  return (
    <section id="reserva" className="relative overflow-hidden bg-leaf-800 py-20 text-cream md:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-sun-400/10 blur-3xl" />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow !text-sun-300" data-reveal>Datas e reserva</span>
          <h2 className="section-title !text-cream" data-reveal>Escolha a data do seu evento</h2>
          <p className="mt-4 text-cream/75" data-reveal>
            Em poucos passos você monta sua solicitação e envia direto para o espaço pelo WhatsApp.
          </p>
        </div>

        <form ref={formRef} onSubmit={submit} noValidate className="mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Coluna de passos */}
          <div className="space-y-6 rounded-[2rem] bg-cream p-4 text-ink shadow-lift sm:p-8" data-reveal>
            {/* Progresso */}
            <div className="flex items-center gap-3" aria-label={`${progress} de 4 etapas preenchidas`}>
              {steps.map((ok, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${ok ? 'bg-sun-500' : 'bg-ink/10'}`} />
              ))}
              <span className="text-xs font-semibold tabular-nums text-ink-mute">{progress}/4</span>
            </div>

            {/* 1. Opção */}
            <fieldset>
              <legend className="flex items-center gap-2 font-display text-xl text-leaf-800">
                <StepNum n={1} done={steps[0]} /> Tipo de evento
              </legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-invalid={!!errors.option} aria-describedby={errors.option ? 'err-option' : undefined}>
                {site.options.map((o, i) => (
                  <label
                    key={o.id}
                    className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2 focus-within:ring-sun-500 ${
                      selectedId === o.id ? 'border-leaf-700 bg-leaf-700 text-cream' : 'border-ink/10 bg-white hover:border-sun-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="option"
                      value={o.id}
                      checked={selectedId === o.id}
                      onChange={() => { onSelect(o.id); clearError('option') }}
                      className="sr-only"
                      data-field={i === 0 ? 'option' : undefined}
                    />
                    <PartyPopper size={18} className={selectedId === o.id ? 'text-sun-300' : 'text-sun-600'} />
                    <span className="text-sm font-semibold leading-tight">
                      {o.name}
                      <span className={`block text-xs font-normal ${selectedId === o.id ? 'text-cream/70' : 'text-ink-mute'}`}>{formatPrice(o.price, o.priceUnit)}</span>
                    </span>
                  </label>
                ))}
              </div>
              <FieldError id="err-option" msg={errors.option} />
            </fieldset>

            {/* 2. Data */}
            <fieldset>
              <legend className="flex items-center gap-2 font-display text-xl text-leaf-800">
                <StepNum n={2} done={steps[1]} /> {multiDay ? 'Dias desejados' : 'Data desejada'}
              </legend>

              <div className="mt-4 inline-flex rounded-full bg-cream-200/70 p-1" role="radiogroup" aria-label="Duração do evento">
                {[
                  { multi: false, label: 'Um dia' },
                  { multi: true, label: 'Vários dias' },
                ].map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    role="radio"
                    aria-checked={multiDay === m.multi}
                    onClick={() => switchMode(m.multi)}
                    className={`min-h-[40px] rounded-full px-5 text-sm font-semibold transition duration-300 ${
                      multiDay === m.multi ? 'bg-leaf-700 text-cream shadow-soft' : 'text-ink-soft hover:text-leaf-800'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              {multiDay && (
                <p className="mt-2 animate-fade text-xs text-ink-mute">Toque em cada dia que deseja incluir. Toque de novo para remover.</p>
              )}

              <div className="mt-4" data-field="date" tabIndex={-1}>
                <Calendar value={dates} multiple={multiDay} onChange={(d) => { setDates(d); clearError('date') }} invalid={!!errors.date} />
              </div>

              {multiDay && dates.length > 0 && (
                <div className="mt-3 flex animate-fade flex-wrap items-center gap-2" aria-live="polite">
                  {dates.map((d) => (
                    <button
                      key={d.getTime()}
                      type="button"
                      onClick={() => setDates(dates.filter((x) => x.getTime() !== d.getTime()))}
                      className="inline-flex min-h-[36px] animate-pop items-center gap-1.5 rounded-full bg-leaf-700 py-1 pl-3 pr-2 text-xs font-semibold text-cream transition hover:bg-leaf-800"
                      aria-label={`Remover ${formatDateLong(d)}`}
                    >
                      {formatDateShort(d)} <X size={14} />
                    </button>
                  ))}
                  <button type="button" onClick={() => setDates([])} className="min-h-[36px] px-2 text-xs font-semibold text-ink-soft underline-offset-2 hover:underline">
                    Limpar
                  </button>
                </div>
              )}
              <FieldError id="err-date" msg={errors.date} />
            </fieldset>

            {/* 3. Período */}
            <fieldset>
              <legend className="flex items-center gap-2 font-display text-xl text-leaf-800">
                <StepNum n={3} done={steps[2]} /> Período
              </legend>
              <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-invalid={!!errors.period}>
                {site.booking.periods.map((p, i) => (
                  <label
                    key={p.id}
                    className={`flex min-h-[56px] cursor-pointer flex-col justify-center rounded-2xl border px-4 py-3 transition focus-within:ring-2 focus-within:ring-sun-500 ${
                      period === p.id ? 'border-sun-500 bg-sun-300/40' : 'border-ink/10 bg-white hover:border-sun-500'
                    }`}
                  >
                    <input type="radio" name="period" value={p.id} checked={period === p.id} onChange={() => { setPeriod(p.id); clearError('period') }} className="sr-only" data-field={i === 0 ? 'period' : undefined} />
                    <span className="text-sm font-semibold">{p.label}</span>
                    <span className="text-xs text-ink-mute">{p.hint}</span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-mute">Horários exatos de início e término são combinados com o espaço.</p>
              <FieldError id="err-period" msg={errors.period} />
            </fieldset>

            {/* 4. Dados */}
            <fieldset>
              <legend className="flex items-center gap-2 font-display text-xl text-leaf-800">
                <StepNum n={4} done={steps[3]} /> Seus dados
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="f-name" className="label">Seu nome *</label>
                  <input id="f-name" data-field="name" className={`field ${errors.name ? '!border-red-400' : ''}`} value={name} onChange={(e) => { setName(e.target.value); clearError('name') }} autoComplete="name" placeholder="Como podemos te chamar?" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} maxLength={80} />
                  <FieldError id="err-name" msg={errors.name} />
                </div>
                <div>
                  <label htmlFor="f-guests" className="label">Nº de convidados *</label>
                  <input id="f-guests" data-field="guests" type="number" inputMode="numeric" min={1} max={option?.capacity ?? undefined} className={`field ${errors.guests ? '!border-red-400' : ''}`} value={guests} onChange={(e) => { setGuests(e.target.value.replace(/\D/g, '')); clearError('guests') }} placeholder="Ex.: 80" aria-invalid={!!errors.guests} aria-describedby={errors.guests ? 'err-guests' : undefined} />
                  <FieldError id="err-guests" msg={errors.guests} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-notes" className="label">Observações <span className="font-normal text-ink-mute">(opcional)</span></label>
                  <textarea id="f-notes" rows={3} className="field resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: aniversário de 15 anos, gostaria de visitar o espaço antes…" maxLength={500} />
                </div>
              </div>
            </fieldset>
          </div>

          {/* Resumo */}
          <aside className="lg:sticky lg:top-24" aria-labelledby="resumo-title" data-reveal style={{ ['--d' as string]: '120ms' }}>
            <div className="overflow-hidden rounded-[2rem] bg-white text-ink shadow-lift">
              <div className="flex items-center gap-2 bg-sun-400 px-6 py-4">
                <Sparkles size={18} />
                <h3 id="resumo-title" className="font-sans text-base font-bold">Resumo da solicitação</h3>
              </div>
              <dl className="divide-y divide-ink/5 px-6">
                <Row icon={<PartyPopper size={16} />} label="Opção" value={option?.name} />
                <Row
                  icon={<CalendarDays size={16} />}
                  label={dates.length > 1 ? `Datas (${datesText})` : 'Data'}
                  value={dates.length > 1 ? dates.map(formatDateShort).join(' · ') : dates[0] ? formatDateLong(dates[0]) : undefined}
                />
                <Row icon={<Clock size={16} />} label="Período" value={periodObj ? `${periodObj.label} · ${periodObj.hint}` : undefined} />
                <Row icon={<Users size={16} />} label="Convidados" value={guests ? `${guests} pessoas` : undefined} />
                <Row icon={<Wallet size={16} />} label="Valor" value={option ? formatPrice(option.price, option.priceUnit) : undefined} />
                <Row icon={<User size={16} />} label="Nome" value={name.trim() || undefined} />
                {notes.trim() && <Row icon={<NotebookPen size={16} />} label="Observações" value={notes.trim()} />}
              </dl>

              <div className="space-y-3 p-6 pt-4">
                <button type="submit" className="btn w-full py-3 leading-tight bg-[#1f9e4f] text-white shadow-soft hover:-translate-y-0.5 hover:bg-[#1a8a44] hover:shadow-lift">
                  <MessageCircle size={19} className="shrink-0" /> Enviar solicitação ao estabelecimento
                </button>

                {sent && (
                  <p role="status" className="flex animate-pop gap-2 rounded-2xl bg-leaf-700/10 p-3 text-sm text-leaf-800">
                    <CheckCircle2 size={18} className="mt-px shrink-0 text-leaf-600" />
                    Abrimos o WhatsApp com sua mensagem pronta. É só tocar em enviar por lá.
                  </p>
                )}

                <button type="button" onClick={() => setShowPreview((s) => !s)} className="flex w-full items-center justify-center gap-1 py-1 text-xs font-semibold text-ink-soft hover:text-leaf-800" aria-expanded={showPreview} aria-controls="msg-preview">
                  {showPreview ? 'Ocultar' : 'Ver'} mensagem que será enviada
                  <ChevronDown size={14} className={`transition ${showPreview ? 'rotate-180' : ''}`} />
                </button>
                {showPreview && (
                  <pre id="msg-preview" className="max-h-64 animate-fade overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-cream p-4 font-sans text-xs leading-relaxed text-ink-soft">{message}</pre>
                )}

                <p className="flex gap-2 rounded-2xl bg-cream p-3 text-xs leading-relaxed text-ink-soft">
                  <AlertCircle size={16} className="mt-px shrink-0 text-sun-600" />
                  <span>Esta é uma <strong>solicitação</strong>, não uma reserva confirmada. A disponibilidade e os valores são confirmados pelo espaço no WhatsApp.</span>
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  )
}

function StepNum({ n, done }: { n: number; done: boolean }) {
  return (
    <span className={`grid h-7 w-7 place-items-center rounded-full font-sans text-xs font-bold transition ${done ? 'bg-leaf-700 text-cream' : 'bg-sun-300/50 text-ink'}`}>
      {done ? <CheckCircle2 size={16} /> : n}
    </span>
  )
}

function Row({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 text-sun-600">{icon}</span>
      <dt className="w-24 shrink-0 text-sm text-ink-mute">{label}</dt>
      <dd key={value} className={`min-w-0 flex-1 break-words text-sm first-letter:uppercase ${value ? 'animate-fade font-semibold text-ink' : 'pending'}`}>{value ?? 'Não selecionado'}</dd>
    </div>
  )
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} role="alert" className="mt-2 flex animate-fade items-center gap-1.5 text-sm font-medium text-red-600">
      <AlertCircle size={15} /> {msg}
    </p>
  )
}
