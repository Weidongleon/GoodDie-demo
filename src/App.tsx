import { useEffect, useMemo, useState } from 'react'
import { MainSeal } from './components/Seal'
import type { TabKey } from './components/ui'
import { COVER, DRAFT, SAMPLE_ENTRIES, type Entry, type Mood, type Tag } from './data'
import {
  ChatScreen,
  ComposeScreen,
  EntryScreen,
  JournalScreen,
  LeaveScreen,
  LetterScreen,
  ReviewScreen,
  SavedScreen,
  TodayScreen,
} from './screens/Screens'

type Route =
  | { name: 'today' }
  | { name: 'chat'; sent: boolean }
  | { name: 'journal' }
  | { name: 'compose' }
  | { name: 'saved'; id: string }
  | { name: 'entry'; id: string }
  | { name: 'review'; period: 'week' | 'month' }
  | { name: 'leave' }
  | { name: 'letter' }

const ROOTS: Record<TabKey, Route> = {
  today: { name: 'today' },
  journal: { name: 'journal' },
  review: { name: 'review', period: 'week' },
  leave: { name: 'leave' },
}

/** Frame index from the Figma file, for the presenter panel. */
const FRAMES: { no: string; label: string; route: Route }[] = [
  { no: '01', label: '今天 / 晨', route: { name: 'today' } },
  { no: '02', label: '记录 / 回忆集', route: { name: 'journal' } },
  { no: '03', label: '回望 / 近七天 / 夜', route: { name: 'review', period: 'week' } },
  { no: '04', label: '留下 / 给未来', route: { name: 'leave' } },
  { no: '05', label: '聊天 / 预设对白', route: { name: 'chat', sent: false } },
  { no: '06', label: '聊天 / 示例已发送', route: { name: 'chat', sent: true } },
  { no: '07', label: '记录 / 写下一页', route: { name: 'compose' } },
  { no: '08', label: '记录 / 收下了', route: { name: 'saved', id: 'demo-saved' } },
  { no: '09', label: '记录详情 / 河边的风', route: { name: 'entry', id: 'river-wind' } },
  { no: '10', label: '新记录 / 用户原话', route: { name: 'entry', id: 'demo-saved' } },
  { no: '11', label: '回望 / 近一个月 / 夜', route: { name: 'review', period: 'month' } },
  { no: '12', label: '留下 / 给未来的信', route: { name: 'letter' } },
  { no: '13', label: '记录详情 / 和妈妈说话', route: { name: 'entry', id: 'mom' } },
]

const FLOW_STARTS: Route[] = [{ name: 'today' }, { name: 'compose' }, { name: 'review', period: 'week' }]

const tabOf = (r: Route): TabKey =>
  r.name === 'today' || r.name === 'chat'
    ? 'today'
    : r.name === 'review'
      ? 'review'
      : r.name === 'leave' || r.name === 'letter'
        ? 'leave'
        : 'journal'

/** The entry used when jumping straight to frames 08 / 10 before anything was saved. */
const DEMO_SAVED: Entry = {
  id: 'demo-saved',
  date: DRAFT.date,
  title: DRAFT.title,
  body: DRAFT.body,
  mood: '安',
  tags: ['散步'],
  latin: 'A day worth keeping',
}

function useFit() {
  const [scale, setScale] = useState(1)
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const isWide = w >= 980
      setWide(isWide)
      const availW = isWide ? w - 420 : w
      const pad = w < 430 ? 32 : 48
      setScale(Math.min(1, (availW - pad) / 393, (h - pad) / 852))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  return { scale, wide }
}

export default function App() {
  const [stack, setStack] = useState<Route[]>([{ name: 'today' }])
  const [saved, setSaved] = useState<Entry[]>([])
  const [currentMood, setCurrentMood] = useState<Mood | null>('安')
  const [done, setDone] = useState<Set<number>>(new Set())
  const [letterKept, setLetterKept] = useState(false)
  const { scale, wide } = useFit()

  const route = stack[stack.length - 1]
  const entries = useMemo(() => [...saved, ...SAMPLE_ENTRIES], [saved])
  const findEntry = (id: string) => entries.find((e) => e.id === id) ?? (id === DEMO_SAVED.id ? DEMO_SAVED : SAMPLE_ENTRIES[0])

  const push = (r: Route) => setStack((s) => [...s, r])
  const replace = (r: Route) => setStack((s) => [...s.slice(0, -1), r])
  const reset = (r: Route) => setStack(r.name === tabOf(r) || r.name === 'review' ? [r] : [ROOTS[tabOf(r)], r])
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  const nav = { onTab: (t: TabKey) => setStack([ROOTS[t]]), onBack: stack.length > 1 ? back : undefined }
  const rootNav = { onTab: nav.onTab }

  const save = (mood: Mood | null, tags: Tag[]) => {
    const id = `saved-${Date.now()}`
    setSaved((s) => [{ id, date: DRAFT.date, title: DRAFT.title, body: DRAFT.body, mood, tags, latin: 'A day worth keeping' }, ...s])
    if (mood) setCurrentMood(mood)
    replace({ name: 'saved', id })
  }

  let screen
  switch (route.name) {
    case 'today':
      screen = (
        <TodayScreen
          nav={rootNav}
          currentMood={currentMood}
          done={done}
          onToggleTask={(i) =>
            setDone((d) => {
              const n = new Set(d)
              if (n.has(i)) n.delete(i)
              else n.add(i)
              return n
            })
          }
          onChat={() => push({ name: 'chat', sent: false })}
          onCompose={() => push({ name: 'compose' })}
        />
      )
      break
    case 'chat':
      screen = (
        <ChatScreen
          nav={nav}
          sent={route.sent}
          onSend={() => replace({ name: 'chat', sent: true })}
          onReset={() => replace({ name: 'chat', sent: false })}
          onCompose={() => push({ name: 'compose' })}
        />
      )
      break
    case 'journal':
      screen = <JournalScreen nav={stack.length > 1 ? nav : rootNav} entries={entries} onOpen={(id) => push({ name: 'entry', id })} onCompose={() => push({ name: 'compose' })} />
      break
    case 'compose':
      screen = <ComposeScreen nav={nav} onSave={save} />
      break
    case 'saved':
      screen = (
        <SavedScreen
          nav={nav}
          entry={findEntry(route.id)}
          onOpen={() => push({ name: 'entry', id: route.id })}
          onJournal={() => setStack([{ name: 'journal' }])}
        />
      )
      break
    case 'entry':
      screen = <EntryScreen nav={nav} entry={findEntry(route.id)} onJournal={() => setStack([{ name: 'journal' }])} />
      break
    case 'review':
      screen = (
        <ReviewScreen
          nav={rootNav}
          period={route.period}
          onPeriod={(p) => replace({ name: 'review', period: p })}
          added={saved.map((e) => e.mood)}
          onLook={() => (route.period === 'week' ? push({ name: 'entry', id: 'river-wind' }) : setStack([{ name: 'journal' }]))}
        />
      )
      break
    case 'leave':
      screen = <LeaveScreen nav={rootNav} kept={letterKept} onLetter={() => push({ name: 'letter' })} />
      break
    case 'letter':
      screen = (
        <LetterScreen
          nav={nav}
          kept={letterKept}
          onKeep={() => {
            if (letterKept) back()
            else setLetterKept(true)
          }}
        />
      )
      break
  }

  const activeFrame = FRAMES.find((f) => JSON.stringify(f.route) === JSON.stringify(route))?.no

  return (
    <div className="flex min-h-full items-center justify-center gap-12 bg-[#e9dcc6] px-0 py-0 sm:px-6 sm:py-6">
      {wide && (
        <aside className="flex w-[340px] shrink-0 flex-col gap-5 text-[#2b2017]">
          <div className="flex items-center gap-3">
            <MainSeal size={44} />
            <div>
              <p className="font-serif text-[17px] leading-6">善终 Good Die</p>
              <p className="t-caption text-[#6b5841]">{COVER.scope}</p>
            </div>
          </div>
          <div>
            <p className="font-serif text-[18px] leading-7">{COVER.title}</p>
            <p className="t-latin text-[20px] text-[#6b5841]">{COVER.echo}</p>
          </div>
          <div className="flex flex-col gap-2">
            {COVER.flows.map((f, i) => (
              <button
                key={f.heading}
                type="button"
                onClick={() => reset(FLOW_STARTS[i])}
                className="rounded-[14px] border border-[#e3d1b2] bg-[#fffbf4] px-4 py-3 text-left transition-colors hover:bg-[#fbf4e8]"
              >
                <p className="font-serif text-[15px] leading-6 font-semibold">{f.heading}</p>
                <p className="t-caption text-[#6b5841]">{f.flow}</p>
              </button>
            ))}
          </div>
          <details className="group rounded-[14px] border border-[#e3d1b2] bg-[#fffbf4]/60 px-4 py-2">
            <summary className="t-label cursor-pointer list-none py-1 text-[#6b5841] select-none">
              13 个界面 <span className="inline-block transition-transform group-open:rotate-90">›</span>
            </summary>
            <ol className="mt-1 grid grid-cols-1 gap-0.5 pb-1">
              {FRAMES.map((f) => (
                <li key={f.no}>
                  <button
                    type="button"
                    onClick={() => reset(f.route)}
                    className={`t-caption w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-[#f3e7d2] ${activeFrame === f.no ? 'bg-[#f3e7d2] text-[#2b2017]' : 'text-[#6b5841]'}`}
                  >
                    <span className="font-latin mr-2">{f.no}</span>
                    {f.label}
                  </button>
                </li>
              ))}
            </ol>
          </details>
          <p className="t-caption text-[#6b5841]">{COVER.limitation}</p>
        </aside>
      )}
      <div style={{ width: 393 * scale, height: 852 * scale }} className="shrink-0 overflow-hidden sm:rounded-[24px]">
        <div
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          className="shadow-[0_24px_60px_-20px_rgba(43,32,23,0.35)] sm:rounded-[24px]"
        >
          {screen}
        </div>
      </div>
    </div>
  )
}
