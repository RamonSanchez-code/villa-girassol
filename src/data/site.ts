/**
 * ============================================================
 *  CONFIGURAÇÃO DO SITE — Espaço Villa Girassol
 * ============================================================
 *  Todo o conteúdo editável do site fica neste arquivo.
 *  Para atualizar textos, preços, fotos, períodos ou datas
 *  indisponíveis, altere apenas os valores abaixo.
 *
 *  Convenções:
 *   - `null` = informação ainda não confirmada. O site mostra
 *     "A confirmar" / "Sob consulta" automaticamente.
 *   - Preços em reais, número (ex.: 1500 → "R$ 1.500").
 *   - Datas no formato "AAAA-MM-DD".
 *
 *  Estrutura pensada para, no futuro, vir de um painel
 *  administrativo / banco de dados (mesmos tipos).
 * ============================================================
 */

export type Photo = {
  src: string
  alt: string
  /** true enquanto a foto for ilustrativa (não é do espaço). Troque por fotos reais e marque false. */
  illustrative: boolean
  /** Enquadramento no recorte (CSS object-position), ex.: 'top', 'center 30%' */
  focus?: string
}

export type EventOption = {
  id: string
  name: string
  tagline: string
  description: string
  image: Photo
  /** Características/indicações da opção */
  features: string[]
  /** Capacidade máxima de convidados. null = a confirmar */
  capacity: number | null
  /** Duração da locação, ex.: "8 horas". null = a confirmar */
  duration: string | null
  /** Valor em R$. null = sob consulta */
  price: number | null
  /** Complemento do preço, ex.: "por evento" */
  priceUnit?: string
  /** Condições ou observações relevantes */
  notes: string
}

export type Period = { id: string; label: string; hint: string }

// Fotos reais da ficha do Google Maps do espaço
const POOL = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TS9MVlJRZ1jtw5KfzXt_ksdYdZw6i4_vLCX3jRheABx52cwa26nErfFfRqevizXMB3eKf1VvlPfmFY37JxxnF5hNVNaW5SEN66kIpbiUu1PquqNwD8-480opSC4QkyrQ55ALe1oJCRwWhy'
const COVERED = 'https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RBIvAtRiCSIkQsPq25cO1Ns9YDaJlKxiAuHc3ZHyysXGJeYNcLQvWQW7IBh8K0IhO-k-wC2YH8xm5OJIRlMNDH1ZaaFk7iy_5mg9FvGIrTeoTgEfBxMIgGAoPyH-eDUguWedOlMXa7oKVL'
const U = 'https://images.unsplash.com/photo-'

export const site = {
  name: 'Espaço Villa Girassol',
  shortName: 'Villa Girassol',
  segment: 'Espaço para eventos',
  headline: 'O lugar perfeito para momentos inesquecíveis.',
  intro:
    'Piscina aquecida, área gourmet e estacionamento privativo em Brodowski/SP. Reservas abertas a partir de novembro de 2026.',
  /** Selo de destaque no topo (deixe '' para ocultar) */
  badge: 'Reservas abertas',

  about: {
    title: 'Espaço amplo para celebrar sem pressa.',
    text: [
      'O Espaço Villa Girassol é um espaço para eventos em Brodowski, no interior de São Paulo, pensado para festas, aniversários, churrascos e confraternizações.',
      'Fica numa região tranquila, de chácaras, e reúne o que o seu evento precisa num só lugar: piscina aquecida, área gourmet, suítes e estacionamento.',
    ],
    highlights: [
      { icon: 'pool', title: 'Piscina aquecida', text: 'Para o seu conforto.' },
      { icon: 'grill', title: 'Área gourmet', text: 'Churrasqueira e cozinha equipada.' },
      { icon: 'bed', title: '2 suítes', text: 'Mais comodidade no dia do evento.' },
      { icon: 'car', title: 'Estacionamento', text: 'Amplo e privativo.' },
    ],
  },

  contact: {
    whatsapp: '5516991253510', // formato internacional, só números
    phoneDisplay: '(16) 99125-3510',
    phoneTel: '+5516991253510',
    email: null as string | null,
    instagram: 'https://www.instagram.com/espacovillagirassol/' as string | null,
    instagramHandle: '@espacovillagirassol',
    facebook: null as string | null,
  },

  location: {
    street: 'Estrada Estela de Lourdes' as string | null,
    city: 'Brodowski',
    state: 'SP',
    cep: '14340-150',
    plusCode: '288G+VM Brodowski, SP',
    lat: -20.9827546,
    lng: -47.6732882,
    mapsUrl: 'https://maps.app.goo.gl/HsGepaM1E81pVa6c7',
  },

  /** Horários fixos de atendimento (opcional). Quando null, mostra `hoursNote`. */
  hours: null as { days: string; time: string }[] | null,
  hoursNote: 'Horários, valores e visitas combinados pelo WhatsApp.',

  booking: {
    /** Dias da semana em que o espaço NÃO recebe eventos (0 = dom ... 6 = sáb) */
    closedWeekdays: [] as number[],
    /** Datas já reservadas/indisponíveis — "AAAA-MM-DD" */
    unavailableDates: [] as string[],
    /** Primeira data aceita para reservas — "AAAA-MM-DD" (locação a partir de nov/2026) */
    firstDate: '2026-11-01',
    /** Antecedência mínima, em dias, para solicitar uma data */
    minAdvanceDays: 2,
    /** Quantos meses à frente o calendário permite navegar */
    monthsAhead: 18,
    periods: [
      { id: 'dia', label: 'Período diurno', hint: 'Manhã e tarde' },
      { id: 'noite', label: 'Período noturno', hint: 'Fim de tarde e noite' },
      { id: 'integral', label: 'Dia inteiro', hint: 'Diurno + noturno' },
    ] as Period[],
  },

  gallery: [
    { src: POOL, alt: 'Piscina aquecida do Espaço Villa Girassol ao entardecer, sob o pergolado iluminado', illustrative: false, focus: 'center 15%' },
    { src: COVERED, alt: 'Área coberta do Espaço Villa Girassol com gramado e trepadeiras', illustrative: false, focus: 'center 60%' },
    { src: `${U}1597848212624-a19eb35e2651`, alt: 'Girassol em close ao entardecer', illustrative: true },
    { src: `${U}1530103862676-de8c9debad1d`, alt: 'Balões coloridos em decoração de festa', illustrative: true },
    { src: `${U}1555244162-803834f70033`, alt: 'Mesa de petiscos e buffet', illustrative: true },
    { src: `${U}1511795409834-ef04bbd61622`, alt: 'Mesa posta com arranjos florais coloridos', illustrative: true },
    { src: `${U}1519225421980-715cb0215aed`, alt: 'Mesa comprida decorada para recepção', illustrative: true },
    { src: `${U}1464366400600-7168b8af9bc3`, alt: 'Mesa decorada com flores para celebração', illustrative: true },
  ] as Photo[],

  options: [
    {
      id: 'festas',
      name: 'Festas e aniversários',
      tagline: 'Infantis, 15 anos e adultos',
      description: 'Locação do espaço para comemorar com família e amigos, com piscina e área gourmet.',
      image: { src: POOL, alt: 'Piscina do Espaço Villa Girassol ao entardecer', illustrative: false, focus: 'center 15%' },
      features: ['Piscina aquecida', 'Área gourmet com churrasqueira', 'Estacionamento privativo'],
      capacity: null,
      duration: null,
      price: null,
      priceUnit: 'por evento',
      notes: 'Valores informados pelo WhatsApp, conforme data, período e número de convidados.',
    },
    {
      id: 'churrascos',
      name: 'Churrascos e confraternizações',
      tagline: 'Amigos, família e empresas',
      description: 'O dia completo para reunir a turma: churrasco, piscina e espaço de sobra.',
      image: { src: COVERED, alt: 'Área coberta do Espaço Villa Girassol', illustrative: false, focus: 'center 60%' },
      features: ['Churrasqueira e cozinha equipada', 'Confraternizações de empresa', 'Encontros de família e amigos'],
      capacity: null,
      duration: null,
      price: null,
      priceUnit: 'por evento',
      notes: 'Valores informados pelo WhatsApp, conforme data, período e número de convidados.',
    },
    {
      id: 'eventos',
      name: 'Eventos e celebrações',
      tagline: 'Chás, encontros e muito mais',
      description: 'Chá de bebê, chá revelação, reuniões e outros momentos especiais.',
      image: { src: `${U}1464366400600-7168b8af9bc3`, alt: 'Mesa decorada com flores para celebração', illustrative: true },
      features: ['Local amplo', '2 suítes', 'Visita ao espaço com agendamento'],
      capacity: null,
      duration: null,
      price: null,
      priceUnit: 'por evento',
      notes: 'Valores informados pelo WhatsApp, conforme data, período e número de convidados.',
    },
  ] as EventOption[],
}

export type Site = typeof site
