// Inlines the Vite build (JS, CSS, images, favicon) into one self-contained
// dist-single/index.html — handy for sharing the demo as a single page.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dist = new URL('../dist/', import.meta.url).pathname
const out = new URL('../dist-single/', import.meta.url).pathname
const assets = readdirSync(join(dist, 'assets'))
const mime = { png: 'image/png', svg: 'image/svg+xml', jpg: 'image/jpeg', webp: 'image/webp' }
const dataUri = (file) => `data:${mime[file.split('.').pop()]};base64,${readFileSync(join(dist, file)).toString('base64')}`

const inlineImages = (code) =>
  assets
    .filter((a) => /\.(png|svg|jpg|webp)$/.test(a))
    .reduce(
      (s, a) =>
        s
          .replaceAll(`./assets/${a}`, dataUri(`assets/${a}`))
          // JS chunks reference siblings as new URL(`name.png`, import.meta.url)
          .replaceAll(`new URL(\`${a}\`,import.meta.url).href`, JSON.stringify(dataUri(`assets/${a}`))),
      code,
    )

let html = readFileSync(join(dist, 'index.html'), 'utf8')
html = html.replace(/<link rel="icon"[^>]*>/, () => `<link rel="icon" href="${dataUri('favicon.svg')}" />`)
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/([^"]+\.css)">/, (_, f) => `<style>${inlineImages(readFileSync(join(dist, 'assets', f), 'utf8'))}</style>`)
html = html.replace(/<script type="module" crossorigin src="\.\/assets\/([^"]+\.js)"><\/script>/, (_, f) => {
  const js = inlineImages(readFileSync(join(dist, 'assets', f), 'utf8')).replaceAll('</script', '<\\/script')
  return ''
    + `<script type="module">${js}</script>`
})
// Module scripts must run after #root exists; move inline script to end of body.
const m = html.match(/<script type="module">[\s\S]*?<\/script>/)
// Function replacers: the minified JS contains `$&`-style sequences that string replacers would expand.
if (m) html = html.replace(m[0], () => '').replace('</body>', () => `${m[0]}\n</body>`)
if (/\.\/assets\//.test(html)) throw new Error('unresolved asset reference left in output')
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'index.html'), html)
console.log(`dist-single/index.html ${(html.length / 1024).toFixed(0)} KB`)
