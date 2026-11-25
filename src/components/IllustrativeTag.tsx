/** Selo exibido enquanto a foto não é do próprio espaço. */
export function IllustrativeTag({ className = '' }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute z-10 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur ${className}`}>
      Imagem ilustrativa
    </span>
  )
}
