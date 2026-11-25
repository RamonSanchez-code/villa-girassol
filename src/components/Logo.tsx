type Props = { className?: string; spin?: boolean }

/** Marca: girassol estilizado. */
export function Sunflower({ className = 'h-8 w-8', spin = false }: Props) {
  return (
    <svg viewBox="-32 -32 64 64" className={className} aria-hidden="true">
      <g className={spin ? 'origin-center animate-spin-slow' : ''} fill="#D9B46E">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} rx="5" ry="13" cy="-16" transform={`rotate(${i * 30})`} opacity={i % 2 ? 0.85 : 1} />
        ))}
      </g>
      <circle r="10" fill="#3E3126" />
      <circle r="10" fill="url(#seeds)" opacity=".5" />
      <defs>
        <pattern id="seeds" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".8" fill="#87642C" />
        </pattern>
      </defs>
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Sunflower className="h-9 w-9 shrink-0" />
      <span className="leading-none">
        <span className={`block text-[11px] font-semibold uppercase tracking-[0.22em] ${light ? 'text-sun-300' : 'text-sun-600'}`}>Espaço</span>
        <span className={`block font-display text-xl ${light ? 'text-white' : 'text-leaf-800'}`}>Villa Girassol</span>
      </span>
    </span>
  )
}
