import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { MainSeal, Seal } from './Seal'
import { MOOD_STYLE, TAG_STYLE, type Entry, type Mood, type Tag } from '../data'
import type { GlyphSealName } from './sealPaths'
import sunflower from '../assets/scenes/sunflower.png'
import bouquet from '../assets/scenes/bouquet.png'
import lantern from '../assets/scenes/lantern.png'
import dandelion from '../assets/scenes/dandelion.png'
import almondBlossom from '../assets/scenes/almond-blossom.png'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

// ---------- Buttons (GoodDie / Button / Primary · Outline · Text) ----------

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'text'
  /** Outline used as the selected segment in the night period switch. */
  tone?: 'raised' | 'sky'
}

export function Button({ variant = 'primary', tone = 'raised', className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        't-label flex h-12 shrink-0 items-center justify-center rounded-full px-4 whitespace-nowrap transition-[transform,filter,background-color] duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        variant === 'primary' && 'bg-gold text-on-gold hover:brightness-[1.04]',
        variant === 'outline' &&
          cx('border border-line text-ink hover:bg-sunk', tone === 'sky' ? 'bg-sky-soft' : 'bg-raised'),
        variant === 'text' && 'text-ink hover:bg-sunk/60',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

// ---------- Surfaces ----------

export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  const base = 'flex w-full flex-col items-start gap-2 rounded-md border border-line bg-raised p-4 text-left'
  if (onClick)
    return (
      <button
        type="button"
        onClick={onClick}
        className={cx(
          base,
          'transition-[transform,box-shadow] duration-150 hover:shadow-[0_2px_10px_rgba(43,32,23,0.06)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-gold',
          className,
        )}
      >
        {children}
      </button>
    )
  return <div className={cx(base, className)}>{children}</div>
}

export function TagChip({ tag, onClick, active = true }: { tag: Tag; onClick?: () => void; active?: boolean }) {
  const s = TAG_STYLE[tag]
  const style = active ? { background: s.bg, color: s.ink } : { background: 'transparent', color: 'var(--gd-muted)' }
  const cls = cx('t-caption rounded-sm px-2 py-0.5 whitespace-nowrap', !active && 'outline outline-1 -outline-offset-1 outline-line')
  if (onClick)
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={cx(cls, 'transition-colors')} style={style}>
        {tag}
      </button>
    )
  return (
    <span className={cls} style={style}>
      {tag}
    </span>
  )
}

export function MoodDot({ mood, size = 8 }: { mood: Mood | null; size?: number }) {
  if (!mood)
    return <span className="inline-block shrink-0 rounded-full border border-line" style={{ width: size, height: size }} />
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: MOOD_STYLE[mood].dot }} />
}

/** GoodDie / EntryCard — user's original words with optional mood. */
export function EntryCard({ entry, full = false, onClick }: { entry: Entry; full?: boolean; onClick?: () => void }) {
  const lines = full ? entry.body : [entry.excerpt ?? entry.body[0]]
  return (
    <Card onClick={onClick}>
      <div className="flex w-full items-center gap-2">
        <span className="t-caption text-muted">{entry.date}</span>
        {entry.mood && (
          <>
            <MoodDot mood={entry.mood} />
            <span className="t-caption" style={{ color: MOOD_STYLE[entry.mood].ink }}>
              {entry.mood}
            </span>
          </>
        )}
        {entry.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
      <p className="t-heading text-ink">{entry.title}</p>
      <div className="t-entry text-ink">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </Card>
  )
}

/** GoodDie / ChatBubble — 提问 is a fixed sample prompt; 原话 is the user's words, never rewritten. */
export function ChatBubble({ role, label, lines }: { role: 'prompt' | 'words'; label: string; lines: string[] }) {
  return (
    <div
      className={cx(
        'gd-rise flex w-full flex-col items-start gap-2 rounded-md border border-line p-4',
        role === 'words' ? 'bg-sunk' : 'bg-raised',
      )}
    >
      <p className={cx('t-caption', role === 'prompt' ? 'text-gold-ink' : 'text-muted')}>{label}</p>
      <div className="t-entry text-ink">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  )
}

export function SectionHeader({ title, detail }: { title: string; detail?: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <h2 className="t-heading text-ink whitespace-nowrap">{title}</h2>
      {typeof detail === 'string' ? <span className="t-caption text-muted whitespace-nowrap">{detail}</span> : detail}
    </div>
  )
}

// ---------- Chrome ----------

export function StatusBar() {
  return (
    <div className="absolute top-3 right-4 left-4 flex items-start justify-between text-ink" aria-hidden="true">
      <span className="t-label">9:41</span>
      <span className="t-caption whitespace-pre">{'•••  100%'}</span>
    </div>
  )
}

export function DateStamp() {
  return (
    <div className="flex w-[85px] flex-col items-end whitespace-nowrap">
      <span className="font-latin text-[24px] leading-7 text-ink">10.13</span>
      <span className="t-caption text-muted">周二</span>
    </div>
  )
}

function Lockup() {
  return (
    <div className="flex w-[110px] flex-col items-start text-ink whitespace-nowrap">
      <span className="font-serif text-[17px] leading-5">善终</span>
      <span className="font-latin text-[8px] leading-[14px] font-medium tracking-[3.36px]">GOOD DIE</span>
    </div>
  )
}

/** Root screens show the seal + lockup; inner screens show 返回 with a centered lockup. */
export function BrandBar({ night = false, onBack }: { night?: boolean; onBack?: () => void }) {
  return (
    <div className="absolute top-11 right-4 left-4 flex h-12 items-center justify-between gap-3">
      {onBack ? (
        <>
          <Button variant="text" className="w-14 px-0" onClick={onBack} aria-label="返回">
            返回
          </Button>
          <Lockup />
        </>
      ) : (
        <div className="flex items-center gap-[10px]">
          <MainSeal reverse={night} />
          <Lockup />
        </div>
      )}
      <DateStamp />
    </div>
  )
}

const SCENES = {
  sunflower,
  bouquet,
  lantern,
  dandelion,
  'almond-blossom': almondBlossom,
} as const
export type SceneName = keyof typeof SCENES

/** GoodDie / SceneHeader — painting with the paper fade and three-line title. */
export function SceneHeader({
  scene,
  overline,
  overlineColor,
  title,
  latin,
  tall,
}: {
  scene: SceneName
  overline: string
  overlineColor: string
  title: string
  latin: string
  tall: boolean
}) {
  return (
    <header className={cx('absolute top-[104px] left-4 w-[361px] overflow-hidden rounded-lg', tall ? 'h-[232px]' : 'h-[184px]')}>
      <img src={SCENES[scene]} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(var(--gd-paper-rgb),0) 0%, rgba(var(--gd-paper-rgb),0) 34%, rgba(var(--gd-paper-rgb),0.97) 74%, rgb(var(--gd-paper-rgb)) 100%)',
        }}
      />
      <div className={cx('absolute left-4 flex w-[329px] flex-col gap-1', tall ? 'top-32' : 'top-20')}>
        <p className="t-overline whitespace-nowrap" style={{ color: overlineColor }}>
          {overline}
        </p>
        <h1 className="t-title text-ink">{title}</h1>
        <p className="t-latin text-muted whitespace-nowrap">{latin}</p>
      </div>
    </header>
  )
}

// ---------- Tab bar ----------

export type TabKey = 'today' | 'journal' | 'review' | 'leave'

const TABS: { key: TabKey; label: string; seal: GlyphSealName; ink: string }[] = [
  { key: 'today', label: '今天', seal: 'jin', ink: 'var(--gd-gold-ink)' },
  { key: 'journal', label: '记录', seal: 'ji', ink: 'var(--gd-blossom-ink)' },
  { key: 'review', label: '回望', seal: 'wang', ink: 'var(--gd-sky-ink)' },
  { key: 'leave', label: '留下', seal: 'liu', ink: 'var(--gd-lilac-ink)' },
]

export function TabBar({ active, night, onSelect }: { active: TabKey; night: boolean; onSelect: (t: TabKey) => void }) {
  return (
    <nav
      className="absolute top-[752px] left-0 flex h-[88px] w-[393px] items-center justify-center border border-line bg-sunk"
      aria-label="主导航"
    >
      {TABS.map((t) => {
        const on = t.key === active
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            aria-current={on ? 'page' : undefined}
            className="flex h-20 w-[98.25px] flex-col items-center justify-center gap-0.5 rounded-md focus-visible:outline-2 focus-visible:outline-gold"
          >
            <span className={cx('flex h-9 items-center justify-center transition-opacity', !on && 'opacity-40')}>
              <Seal name={t.seal} tone={on ? 'colored' : night ? 'reverse' : 'mono'} size={on ? 36 : 40} />
            </span>
            <span className="t-caption" style={{ color: on ? t.ink : 'var(--gd-muted)' }}>
              {t.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export function HomeIndicator() {
  return <div className="absolute top-[840px] left-[136.5px] h-1 w-[120px] rounded-[2px] bg-ink" aria-hidden="true" />
}
