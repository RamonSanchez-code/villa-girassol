import { useCallback, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Gallery } from './components/Gallery'
import { Options } from './components/Options'
import { Booking } from './components/Booking'
import { Location } from './components/Location'
import { Contact, Footer } from './components/Contact'
import { WhatsAppFab } from './components/WhatsAppFab'
import { Toast } from './components/Toast'
import { site } from './data/site'
import { scrollToId } from './lib/utils'
import { useReveal } from './lib/useReveal'

export default function App() {
  useReveal()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null)
  const timer = useRef<number>()

  const notify = useCallback((msg: string) => {
    window.clearTimeout(timer.current)
    setToast({ msg, id: Date.now() })
    timer.current = window.setTimeout(() => setToast(null), 3200)
  }, [])

  const selectFromCard = (id: string) => {
    setSelectedId(id)
    const name = site.options.find((o) => o.id === id)?.name
    notify(`“${name}” selecionada. Agora escolha a data.`)
    window.setTimeout(() => scrollToId('reserva'), 350)
  }

  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-sun-400 focus:px-4 focus:py-2 focus:font-semibold">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Gallery />
        <Options selectedId={selectedId} onSelect={selectFromCard} />
        <Booking selectedId={selectedId} onSelect={setSelectedId} notify={notify} />
        <Location />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
      <Toast message={toast?.msg ?? null} id={toast?.id ?? 0} />
    </>
  )
}
