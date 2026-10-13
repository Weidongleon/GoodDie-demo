// Writes public/favicon.svg from the 善终 main seal geometry.
// Run: node --experimental-strip-types scripts/make-favicon.ts
import { writeFileSync } from 'node:fs'
import { MAIN_BLOSSOM, MAIN_BLOSSOM_DOT, MAIN_BLOSSOM_RING, MAIN_COLORS, MAIN_GLYPH, MAIN_SEAL_DOTS, MAIN_SQUARE } from '../src/components/sealPaths.ts'

const c = MAIN_COLORS.main
const p = (d: string, fill: string, extra = '') => `<path d="${d}" fill="${fill}"${extra}/>`
const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<mask id="s" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="36">${p(MAIN_SQUARE, 'white')}${MAIN_BLOSSOM.map((d) => p(d, 'black')).join('')}${p(MAIN_BLOSSOM_RING, 'white')}${p(MAIN_GLYPH, 'black', ' stroke="black" stroke-width="2.4" stroke-linejoin="round"')}${MAIN_SEAL_DOTS.map((d) => p(d, 'black')).join('')}</mask>
<g mask="url(#s)"><path d="M38 2H2V38H38V2Z" fill="${c.square}"/></g>
<mask id="f" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="4" y="12" width="15" height="15">${p(MAIN_BLOSSOM[0], 'white')}${MAIN_BLOSSOM.slice(1).map((d) => p(d, 'black')).join('')}${p(MAIN_BLOSSOM_RING, 'black')}</mask>
<g mask="url(#f)"><path d="M40 0H0V40H40V0Z" fill="${c.blossom}"/></g>
${p(MAIN_BLOSSOM_DOT, c.dot)}
</svg>
`
writeFileSync(new URL('../public/favicon.svg', import.meta.url), svg)
console.log('wrote public/favicon.svg')
