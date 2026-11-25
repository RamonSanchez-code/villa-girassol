import { CheckCircle2 } from 'lucide-react'

export function Toast({ message, id }: { message: string | null; id: number }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4">
      {message && (
        <p key={id} className="flex animate-pop items-center gap-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-cream shadow-lift">
          <CheckCircle2 size={18} className="shrink-0 text-sun-300" /> {message}
        </p>
      )}
    </div>
  )
}
