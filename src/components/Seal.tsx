import { useId } from 'react'
import {
  ACCENT_CUT_CENTER,
  GLYPHS,
  MAIN_BLOSSOM,
  MAIN_BLOSSOM_DOT,
  MAIN_BLOSSOM_RING,
  MAIN_COLORS,
  MAIN_GLYPH,
  MAIN_SEAL_DOTS,
  MAIN_SQUARE,
  PETALS,
  SEAL_COLORS,
  SEAL_MONO,
  SEAL_REVERSE,
  type GlyphSealName,
} from './sealPaths'

type SealProps = {
  name: GlyphSealName
  /** colored = 原色印; mono = tab bar (晨); reverse = tab bar (夜) */
  tone?: 'colored' | 'mono' | 'reverse'
  size?: number
  className?: string
}

/** Flower-shaped seal (今 / 记 / 望 / 留 / 收), rebuilt from the Figma mask structure. */
export function Seal({ name, tone = 'colored', size = 40, className }: SealProps) {
  const id = useId().replace(/:/g, '')
  const body = tone === 'colored' ? SEAL_COLORS[name].body : tone === 'mono' ? SEAL_MONO : SEAL_REVERSE
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <mask id={`${id}-b`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="35">
        {PETALS.map((d) => (
          <path key={d} d={d} fill="white" />
        ))}
        <path d={GLYPHS[name]} fill="black" stroke="black" strokeWidth="2.8" strokeLinejoin="round" />
      </mask>
      <g mask={`url(#${id}-b)`}>
        <path d="M40 0H0V40H40V0Z" fill={body} />
      </g>
      {tone === 'colored' && (
        <>
          <mask id={`${id}-a`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="35">
            <path d={PETALS[4]} fill="white" />
            {PETALS.slice(0, 4).map((d) => (
              <path key={d} d={d} fill="black" />
            ))}
            <path d={ACCENT_CUT_CENTER} fill="black" />
          </mask>
          <g mask={`url(#${id}-a)`}>
            <path d="M40 0H0V40H40V0Z" fill={SEAL_COLORS[name].accent} />
          </g>
        </>
      )}
    </svg>
  )
}

/** 善终 square brand seal. `reverse` is the night (夜) variant. */
export function MainSeal({ reverse = false, size = 40, className }: { reverse?: boolean; size?: number; className?: string }) {
  const id = useId().replace(/:/g, '')
  const c = reverse ? MAIN_COLORS.reverse : MAIN_COLORS.main
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="善终"
    >
      <mask id={`${id}-s`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="36">
        <path d={MAIN_SQUARE} fill="white" />
        {MAIN_BLOSSOM.map((d) => (
          <path key={d} d={d} fill="black" />
        ))}
        <path d={MAIN_BLOSSOM_RING} fill="white" />
        <path d={MAIN_GLYPH} fill="black" stroke="black" strokeWidth="2.4" strokeLinejoin="round" />
        {MAIN_SEAL_DOTS.map((d) => (
          <path key={d} d={d} fill="black" />
        ))}
      </mask>
      <g mask={`url(#${id}-s)`}>
        <path d="M38 2H2V38H38V2Z" fill={c.square} />
      </g>
      {c.blossom && (
        <>
          <mask id={`${id}-f`} style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="4" y="12" width="15" height="15">
            <path d={MAIN_BLOSSOM[0]} fill="white" />
            {MAIN_BLOSSOM.slice(1).map((d) => (
              <path key={d} d={d} fill="black" />
            ))}
            <path d={MAIN_BLOSSOM_RING} fill="black" />
          </mask>
          <g mask={`url(#${id}-f)`}>
            <path d="M40 0H0V40H40V0Z" fill={c.blossom} />
          </g>
        </>
      )}
      <path d={MAIN_BLOSSOM_DOT} fill={c.dot} />
    </svg>
  )
}
