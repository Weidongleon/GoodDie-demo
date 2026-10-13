# 善终 Good Die · Demo App

A clickable, live implementation of the Figma design
[Good Die Demo App Design](https://www.figma.com/design/wtKZMxNJuRRnDkomAC4mZ6/Good-Die-Demo-App-Design?node-id=0-1)
(page **01 · 全新 Demo 原型**, 13 screens), built on the same stack as the
[Good Die Demo App Figma Make file](https://www.figma.com/make/1l5V3BUmP53giQmR9maj6J/Good-Die-Demo-App):
React 19 + Vite + Tailwind CSS v4 + TypeScript.

## Run it

```bash
npm install
npm run dev          # local dev server
npm run build        # type-check + production build → dist/
npm run build:single # one self-contained HTML file → dist-single/index.html
```

On a wide screen the phone sits next to a presenter panel with the three demo flows
and a jump list for all 13 Figma frames. On a phone it fills the screen.

## What's interactive

| Flow | Path |
| --- | --- |
| 01 · 聊天展示 | 今天 → 聊聊 → 发送 (or tap the quick reply) → 记下 |
| 02 · 快速记录 | 记下 → pick a mood (or 暂不选) and tags → 收下 → 看看 / tap the card |
| 03 · 近期回望 | 回望 → switch 近七天 / 近一个月 → 看看 |
| 留下 | 写下 / tap the letter → 收下 |

Entries saved in the composer show up in 记录, update the 回望 counts, and set
"此刻" on 今天, for the current session only. As the design notes say, text input,
real storage and AI are not connected.

## Structure

- `src/index.css`: design tokens from the Figma variables (`GoodDie / 原色`,
  `GoodDie / 晨与夜` with 晨 / 夜 modes) and the `GoodDie / *` text styles.
- `src/components/sealPaths.ts` + `Seal.tsx`: the v0.2 flower seals and 善终 brand
  seal, rebuilt from the exact vector geometry exported from Figma (colored, mono,
  and night-reverse variants).
- `src/components/ui.tsx`: Button, Card, EntryCard, ChatBubble, SceneHeader, TabBar…
- `src/screens/Screens.tsx`: the screens. `src/App.tsx`: navigation and demo state.
- `src/assets/scenes/`: the five paintings.

## Known gap

The painted headers in `src/assets/scenes/` are 240 px renders. The originals in
Figma are 1200 px, but this build environment could not download them. For crisp
headers on retina screens, export the five `GoodDie / Painting / *` components from
the Figma page **02 · 组件与原作** at 2x and replace the PNGs, keeping the file names.
