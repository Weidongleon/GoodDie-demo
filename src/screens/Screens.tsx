import { useState, type ReactNode } from 'react'
import {
  BrandBar,
  Button,
  Card,
  ChatBubble,
  EntryCard,
  HomeIndicator,
  MoodDot,
  SceneHeader,
  SectionHeader,
  StatusBar,
  TabBar,
  TagChip,
  type SceneName,
  type TabKey,
} from '../components/ui'
import { Seal } from '../components/Seal'
import {
  DRAFT,
  LETTER,
  MONTH_COUNTS,
  MONTH_DAYS,
  MONTH_RECORDS,
  MONTH_TOPICS,
  MOODS,
  MOOD_STYLE,
  TASKS,
  WEEK,
  WEEK_DAYS,
  WEEK_RECORDS,
  type Entry,
  type Mood,
  type Tag,
} from '../data'

// ---------- Screen frame (393 × 852, matches the Figma frames) ----------

type FrameProps = {
  tab: TabKey
  night?: boolean
  onTab: (t: TabKey) => void
  onBack?: () => void
  header: { scene: SceneName; overline: string; overlineColor: string; title: string; latin: string }
  /** Root tab screens use the tall 232px header; inner screens use 184px. */
  tall?: boolean
  /** Distance from header bottom to content (12 or 20 in the design). */
  gap?: number
  /** Bottom docked element: a primary CTA (default) or a custom block such as the chat composer. */
  cta?: { label: string; onClick: () => void }
  dock?: ReactNode
  dockTop?: number
  children: ReactNode
}

export function Frame({ tab, night = false, onTab, onBack, header, tall = !onBack, gap = 20, cta, dock, dockTop = 696, children }: FrameProps) {
  const contentTop = 104 + (tall ? 232 : 184) + gap
  const contentBottom = dockTop - 8
  return (
    <div data-theme={night ? 'night' : undefined} className="relative h-[852px] w-[393px] overflow-hidden rounded-[24px] bg-paper text-ink">
      <StatusBar />
      <BrandBar night={night} onBack={onBack} />
      <SceneHeader {...header} tall={tall} />
      <main
        className="gd-scroll absolute left-4 w-[361px] overflow-y-auto"
        style={{ top: contentTop, height: contentBottom - contentTop }}
      >
        <div key={header.title} className="gd-rise flex flex-col items-start gap-4 pb-2">
          {children}
        </div>
      </main>
      {dock}
      {cta && (
        <Button className="absolute top-[696px] left-4 w-[361px]" onClick={cta.onClick}>
          {cta.label}
        </Button>
      )}
      <TabBar active={tab} night={night} onSelect={onTab} />
      <HomeIndicator />
    </div>
  )
}

const ink = {
  gold: 'var(--gd-gold-ink)',
  blossom: 'var(--gd-blossom-ink)',
  sky: 'var(--gd-sky-ink)',
  lilac: 'var(--gd-lilac-ink)',
}

type Nav = { onTab: (t: TabKey) => void; onBack?: () => void }

// ---------- 01 · 今天 / 晨 ----------

export function TodayScreen({
  nav,
  currentMood,
  done,
  onToggleTask,
  onChat,
  onCompose,
}: {
  nav: Nav
  currentMood: Mood | null
  done: Set<number>
  onToggleTask: (i: number) => void
  onChat: () => void
  onCompose: () => void
}) {
  return (
    <Frame
      tab="today"
      {...nav}
      gap={12}
      header={{ scene: 'sunflower', overline: 'MORNING · 晨间', overlineColor: ink.gold, title: '今天，好好收下', latin: 'Turn toward the light' }}
      cta={{ label: '记下', onClick: onCompose }}
    >
      <SectionHeader title="给今天一点方向" detail="按自己的步子来" />
      <Card>
        {TASKS.map((t, i) => {
          const last = i === TASKS.length - 1
          const checked = done.has(i)
          return (
            <button
              key={t}
              type="button"
              onClick={() => (last ? onCompose() : onToggleTask(i))}
              aria-pressed={last ? undefined : checked}
              className={`flex w-full items-center gap-3 rounded-sm text-left ${last ? 'h-11' : 'h-9'}`}
            >
              <span
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${checked ? 'border-sage bg-sage' : 'border-line'}`}
              >
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 5.2 4.1 7.2 8 3" fill="none" stroke="#fffbf4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={`t-ui transition-colors ${checked ? 'text-muted line-through decoration-line' : 'text-ink'}`}>{t}</span>
            </button>
          )
        })}
      </Card>
      <Card>
        <div className="flex w-full items-center gap-3">
          <div className="flex w-[219px] flex-col gap-1">
            <p className="t-heading text-ink">说说今天</p>
            <p className="t-caption text-muted">从一件小事开始就好。</p>
          </div>
          <Button variant="outline" className="ml-auto w-[94px]" onClick={onChat}>
            聊聊
          </Button>
        </div>
      </Card>
      <div className="-mt-2 flex w-full items-center gap-2">
        <MoodDot mood={currentMood} />
        <span className="t-caption" style={{ color: currentMood ? MOOD_STYLE[currentMood].ink : 'var(--gd-muted)' }}>
          此刻 · {currentMood ?? '未选'}
        </span>
        <span className="t-caption text-muted">也可以什么都不选。</span>
      </div>
    </Frame>
  )
}

// ---------- 05 / 06 · 聊天 ----------

export function ChatScreen({ nav, sent, onSend, onReset, onCompose }: { nav: Nav; sent: boolean; onSend: () => void; onReset: () => void; onCompose: () => void }) {
  const reply = '下午去了河边，风很软。'
  return (
    <Frame
      tab="today"
      {...nav}
      header={{ scene: 'sunflower', overline: 'CONVERSATION · 示例对话', overlineColor: ink.gold, title: '说说今天', latin: 'A little room for your day' }}
      dockTop={636}
      dock={
        <div className="absolute top-[636px] left-4 flex h-[104px] w-[361px] flex-col gap-2 rounded-md border border-line bg-raised p-4">
          <p className="t-ui text-muted">{sent ? '这段话已发送。' : '想说的话，慢慢写……'}</p>
          <div className="flex w-full items-start justify-between gap-2">
            <p className="t-caption text-muted">{sent ? '回到示例开头' : '点击发送示例消息'}</p>
            <Button className="-mt-1 w-[88px]" onClick={sent ? onReset : onSend}>
              {sent ? '重看' : '发送'}
            </Button>
          </div>
        </div>
      }
    >
      <div className={`flex w-full flex-col items-start ${sent ? 'gap-2' : 'gap-4'}`}>
        <p className="t-caption text-muted">10.13 · 16:20</p>
        <ChatBubble role="prompt" label="善终 · 示例对白" lines={sent ? ['今天，有什么小事想留下来？'] : ['今天，有什么小事', '想留下来？']} />
        {sent ? (
          <>
            <ChatBubble role="words" label="你" lines={DRAFT.body} />
            <Button variant="outline" className="gd-rise w-32" onClick={onCompose}>
              记下
            </Button>
          </>
        ) : (
          <>
            <p className="t-caption text-muted">选一段话，看看对话的样子</p>
            <Button variant="outline" className="w-full" onClick={onSend}>
              {reply}
            </Button>
          </>
        )}
      </div>
    </Frame>
  )
}

// ---------- 02 · 记录 / 回忆集 ----------

export function JournalScreen({ nav, entries, onOpen, onCompose }: { nav: Nav; entries: Entry[]; onOpen: (id: string) => void; onCompose: () => void }) {
  const extra = entries.length - 2
  return (
    <Frame
      tab="journal"
      {...nav}
      header={{ scene: 'bouquet', overline: 'JOURNAL · 记录', overlineColor: ink.blossom, title: '把日子，一页页收好', latin: 'Days, gathered gently' }}
      cta={{ label: '记下', onClick: onCompose }}
    >
      <SectionHeader title="最近的记录" detail={`${9 + extra} 条 · 示例`} />
      {entries.map((e) => (
        <EntryCard key={e.id} entry={e} onClick={() => onOpen(e.id)} />
      ))}
    </Frame>
  )
}

// ---------- 07 · 记录 / 写下一页 ----------

export function ComposeScreen({ nav, onSave }: { nav: Nav; onSave: (mood: Mood | null, tags: Tag[]) => void }) {
  const [mood, setMood] = useState<Mood | null>('安')
  const [tags, setTags] = useState<Tag[]>(['散步', '河边'])
  const toggle = (t: Tag) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  return (
    <Frame
      tab="journal"
      {...nav}
      header={{ scene: 'almond-blossom', overline: 'A NEW PAGE · 新的一页', overlineColor: ink.blossom, title: '记下这一刻', latin: 'A new page, yours' }}
      cta={{ label: '收下', onClick: () => onSave(mood, (['散步', '河边'] as Tag[]).filter((t) => tags.includes(t))) }}
    >
      <Card>
        <p className="t-caption text-muted">{DRAFT.date} · 示例草稿</p>
        <div className="t-entry text-ink">
          {DRAFT.body.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <div className="h-px w-full bg-line" />
        <p className="t-caption text-muted">没有必填项，写多少都可以。</p>
      </Card>
      <div className="flex w-full items-center justify-between gap-2">
        <h2 className="t-heading text-ink">此刻的心情</h2>
        <Button variant="text" className="h-11 w-[84px]" onClick={() => setMood(null)} aria-pressed={mood === null}>
          {mood === null ? '未选' : '暂不选'}
        </Button>
      </div>
      <div className="flex w-full gap-1.5" role="radiogroup" aria-label="此刻的心情">
        {MOODS.map((m) => {
          const on = mood === m
          return (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setMood(on ? null : m)}
              className="flex h-[68px] w-[46px] flex-col items-center justify-center gap-1 rounded-sm transition-colors"
              style={{ background: on ? MOOD_STYLE[m].soft : 'transparent' }}
            >
              <MoodDot mood={m} size={10} />
              <span className="t-caption text-ink">{m}</span>
            </button>
          )
        })}
      </div>
      <div className="flex w-full gap-2">
        {(['散步', '河边'] as Tag[]).map((t) => (
          <TagChip key={t} tag={t} active={tags.includes(t)} onClick={() => toggle(t)} />
        ))}
      </div>
      <p className="t-caption text-muted">这些话，先留给自己。</p>
    </Frame>
  )
}

// ---------- 08 · 记录 / 收下了 ----------

export function SavedScreen({ nav, entry, onOpen, onJournal }: { nav: Nav; entry: Entry; onOpen: () => void; onJournal: () => void }) {
  return (
    <Frame
      tab="journal"
      {...nav}
      header={{ scene: 'almond-blossom', overline: 'KEPT · 记录', overlineColor: ink.blossom, title: '这一刻，收下了', latin: 'A moment, kept' }}
      cta={{ label: '看看', onClick: onJournal }}
    >
      <div className="flex w-full items-center gap-3">
        <Seal name="shou" size={56} className="gd-stamp shrink-0" />
        <div className="flex w-[280px] flex-col">
          <p className="t-heading text-ink">收下了。</p>
          <p className="t-caption text-muted">{entry.mood ? '原话已收下，心情也可以留空。' : '原话已收下，这次没有选心情。'}</p>
        </div>
      </div>
      <EntryCard entry={entry} full onClick={onOpen} />
      <p className="t-caption text-muted">这是保存效果的示例预览。</p>
    </Frame>
  )
}

// ---------- 09 / 10 / 13 · 记录详情 ----------

export function EntryScreen({ nav, entry, onJournal }: { nav: Nav; entry: Entry; onJournal: () => void }) {
  return (
    <Frame
      tab="journal"
      {...nav}
      header={{ scene: 'almond-blossom', overline: 'ONE PAGE · 一页记忆', overlineColor: ink.blossom, title: entry.title, latin: entry.latin }}
      cta={{ label: '回看', onClick: onJournal }}
    >
      <EntryCard entry={entry} full />
      <p className="t-caption text-muted">你的原话，照原样收着。</p>
    </Frame>
  )
}

// ---------- 03 / 11 · 回望 / 夜 ----------

export function ReviewScreen({
  nav,
  period,
  onPeriod,
  added,
  onLook,
}: {
  nav: Nav
  period: 'week' | 'month'
  onPeriod: (p: 'week' | 'month') => void
  /** Moods of entries saved during this session (null = saved without a mood). */
  added: (Mood | null)[]
  onLook: () => void
}) {
  const week = period === 'week'
  const addedMoods = added.filter((m): m is Mood => m !== null)
  const weekDays = WEEK.map((d) =>
    d.day === '13' ? { ...d, moods: [...new Set([...d.moods, ...addedMoods])].slice(0, 3) } : d,
  )
  // Counts are listed most-frequent first (ties keep the 喜安爱盼思烦倦 order), as in the design.
  const byCount = (a: readonly [Mood, number], b: readonly [Mood, number]) => b[1] - a[1]
  const weekCounts = MOODS.map((m) => [m, weekDays.flatMap((d) => d.moods).filter((x) => x === m).length] as const)
    .filter(([, n]) => n > 0)
    .sort(byCount)
  const monthCounts = MOODS.map((m) => [m, MONTH_COUNTS[m] + addedMoods.filter((x) => x === m).length] as const).sort(byCount)
  const rows = [monthCounts.slice(0, 2), monthCounts.slice(2, 4), monthCounts.slice(4, 6), monthCounts.slice(6)]
  return (
    <Frame
      tab="review"
      night
      {...nav}
      gap={12}
      header={
        week
          ? { scene: 'lantern', overline: 'REFLECTION · 回望', overlineColor: ink.sky, title: '看看最近的你', latin: 'These days, softly' }
          : { scene: 'lantern', overline: 'REFLECTION · 回望', overlineColor: ink.sky, title: '把近来的日子放在一起', latin: 'Small moments, seen together' }
      }
      cta={{ label: '看看', onClick: onLook }}
    >
      <div className="-mb-1 flex w-full gap-2" role="tablist" aria-label="时间范围">
        {(['week', 'month'] as const).map((p) => (
          <Button
            key={p}
            role="tab"
            aria-selected={period === p}
            variant={period === p ? 'outline' : 'text'}
            tone="sky"
            className="flex-1"
            onClick={() => onPeriod(p)}
          >
            {p === 'week' ? '近七天' : '近一个月'}
          </Button>
        ))}
      </div>
      {week ? (
        <>
          <Card>
            <div className="flex w-full items-start gap-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <span className="t-numeral text-ink">{WEEK_RECORDS + added.length}</span>
                <span className="t-caption text-muted">条记录</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="t-numeral text-ink">{WEEK_DAYS}</span>
                <span className="t-caption text-muted">天留下了片段</span>
              </div>
            </div>
            <p className="t-caption text-muted">10.07 — 10.13 · 按你选的心情呈现</p>
            <div className="flex w-full gap-2">
              {weekDays.map((d) => (
                <div key={d.day} className="flex w-10 flex-col items-center gap-1">
                  <span className="t-caption text-muted">{d.day}</span>
                  <span className="flex h-[14px] items-center justify-center gap-[3px]">
                    {d.moods.length ? d.moods.map((m) => <MoodDot key={m} mood={m} />) : <MoodDot mood={null} />}
                  </span>
                  <span className={`t-caption whitespace-nowrap ${d.moods.length ? 'text-ink' : 'text-muted'}`}>
                    {d.moods.length ? d.moods.join('') : '未记录'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-wrap gap-x-3">
              {weekCounts.map(([m, n]) => (
                <span key={m} className="flex items-center gap-[3px]">
                  <MoodDot mood={m} size={6} />
                  <span className="t-caption text-ink">
                    {m} {n}
                  </span>
                </span>
              ))}
            </div>
          </Card>
          <Card>
            <p className="t-entry text-ink">“河边的风很软。”</p>
          </Card>
        </>
      ) : (
        <Card>
          <div className="flex w-full items-center gap-4 whitespace-nowrap">
            <span className="t-numeral text-ink">{MONTH_RECORDS + added.length}</span>
            <span className="t-caption text-muted">
              条记录 · {MONTH_DAYS} 天留下片段
            </span>
          </div>
          <p className="t-caption text-muted">09.14 — 10.13 · 示例数据</p>
          <div className="flex w-full flex-col gap-2">
            {rows.map((row, i) => (
              <div key={i} className="flex w-full gap-4">
                {row.map(([m, n]) => (
                  <div key={m} className="flex w-[156.5px] items-center gap-2">
                    <span className="t-caption text-ink">{m}</span>
                    <span className="flex items-center gap-1">
                      {Array.from({ length: n }, (_, k) => (
                        <MoodDot key={k} mood={m} size={7} />
                      ))}
                    </span>
                    <span className="t-caption text-muted">{n}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="t-ui text-ink">{MONTH_TOPICS}</p>
        </Card>
      )}
    </Frame>
  )
}

// ---------- 04 · 留下 / 给未来 ----------

export function LeaveScreen({ nav, kept, onLetter }: { nav: Nav; kept: boolean; onLetter: () => void }) {
  return (
    <Frame
      tab="leave"
      {...nav}
      header={{ scene: 'dandelion', overline: 'FOR THE FUTURE · 留下', overlineColor: ink.lilac, title: '有些话，慢慢留下', latin: 'Words for the days ahead' }}
      cta={{ label: '写下', onClick: onLetter }}
    >
      <Card>
        <p className="t-heading text-ink">写给未来的自己</p>
        <div className="t-entry text-ink">
          <p>想留下些什么，不必今天就想明白。</p>
          <p>一句话，一封信，都可以。</p>
        </div>
        <span className="t-caption rounded-sm bg-lilac-soft px-2 py-0.5 text-lilac-ink">只有你能看到</span>
      </Card>
      <Card onClick={onLetter}>
        <p className="t-caption text-muted">给一年以后的自己 · {kept ? '已收下' : '示例草稿'}</p>
        <div className="t-entry text-ink">
          <p>希望那时的你，仍记得此刻</p>
          <p>窗外的光。</p>
        </div>
      </Card>
    </Frame>
  )
}

// ---------- 12 · 留下 / 给未来的信 ----------

export function LetterScreen({ nav, kept, onKeep }: { nav: Nav; kept: boolean; onKeep: () => void }) {
  return (
    <Frame
      tab="leave"
      {...nav}
      header={{ scene: 'dandelion', overline: 'LETTER · 给未来', overlineColor: ink.lilac, title: '写给一年以后的你', latin: 'A letter to tomorrow' }}
      cta={{ label: kept ? '已收下' : '收下', onClick: onKeep }}
    >
      <Card>
        <p className="t-caption text-lilac-ink">{LETTER.address}</p>
        <div className="t-entry text-ink">
          {LETTER.body.map((l, i) => (
            <p key={i}>{l || '​'}</p>
          ))}
        </div>
        <div className="h-px w-full bg-line" />
        <div className="flex w-full items-center justify-between">
          <p className="t-caption text-muted">{kept ? '已收下' : '示例草稿'} · 只有你能看到</p>
          {kept && <Seal name="liu" size={28} className="gd-stamp" />}
        </div>
      </Card>
    </Frame>
  )
}
