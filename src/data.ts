// Fixed sample content from the Figma prototype ("01 · 全新 Demo 原型").
// The demo has no real storage, text input or AI — entries saved in the
// composer live only in memory for the current session.

export const MOODS = ['喜', '安', '爱', '盼', '思', '烦', '倦'] as const
export type Mood = (typeof MOODS)[number]

/** Each mood maps to a palette family: dot color, text ink, soft background. */
export const MOOD_STYLE: Record<Mood, { dot: string; ink: string; soft: string }> = {
  喜: { dot: 'var(--gd-gold)', ink: 'var(--gd-gold-ink)', soft: 'var(--gd-gold-soft)' },
  安: { dot: 'var(--gd-sky)', ink: 'var(--gd-sky-ink)', soft: 'var(--gd-sky-soft)' },
  爱: { dot: 'var(--gd-blossom)', ink: 'var(--gd-blossom-ink)', soft: 'var(--gd-blossom-soft)' },
  盼: { dot: 'var(--gd-sage)', ink: 'var(--gd-sage-ink)', soft: 'var(--gd-sage-soft)' },
  思: { dot: 'var(--gd-lilac)', ink: 'var(--gd-lilac-ink)', soft: 'var(--gd-lilac-soft)' },
  烦: { dot: 'var(--gd-coral)', ink: 'var(--gd-coral-ink)', soft: 'var(--gd-coral-soft)' },
  倦: { dot: 'var(--gd-muted)', ink: 'var(--gd-muted)', soft: 'var(--gd-sunk)' },
}

export type Tag = '散步' | '河边' | '家人' | '日常'
export const TAG_STYLE: Record<Tag, { bg: string; ink: string }> = {
  散步: { bg: 'var(--gd-sage-soft)', ink: 'var(--gd-sage-ink)' },
  日常: { bg: 'var(--gd-sage-soft)', ink: 'var(--gd-sage-ink)' },
  家人: { bg: 'var(--gd-sage-soft)', ink: 'var(--gd-sage-ink)' },
  河边: { bg: 'var(--gd-sky-soft)', ink: 'var(--gd-sky-ink)' },
}

export type Entry = {
  id: string
  date: string
  title: string
  /** Full original words, one string per line. */
  body: string[]
  /** List preview; falls back to the first line of body. */
  excerpt?: string
  mood: Mood | null
  tags: Tag[]
  latin: string
}

export const SAMPLE_ENTRIES: Entry[] = [
  {
    id: 'river-wind',
    date: '10.13 · 16:20',
    title: '河边的风很软',
    body: ['走了一小段路，看到树叶落在水面上。', '风从桥下吹过来，我慢慢地走回家。'],
    excerpt: '走了一小段路，看到树叶……',
    mood: '安',
    tags: ['散步'],
    latin: 'A day worth keeping',
  },
  {
    id: 'mom',
    date: '10.12 · 19:40',
    title: '和妈妈说了会儿话',
    body: ['她说，阳台上的花又开了。'],
    mood: '盼',
    tags: ['家人'],
    latin: 'A small, familiar warmth',
  },
]

/** The draft the composer shows — the same words the user "sent" in the chat demo. */
export const DRAFT = {
  title: '河边的一刻',
  body: ['下午去了河边，风很软。', '我想把这一刻记下来。'],
  date: '10.13 · 16:20',
}

export const TASKS = ['去河边走一小段路', '和妈妈说说话', '留一件今天想记住的事'] as const

export const WEEK = [
  { day: '07', moods: ['安'] },
  { day: '08', moods: ['思', '倦'] },
  { day: '09', moods: ['喜'] },
  { day: '10', moods: [] },
  { day: '11', moods: ['爱', '安'] },
  { day: '12', moods: ['盼'] },
  { day: '13', moods: ['安', '喜'] },
] as { day: string; moods: Mood[] }[]

export const WEEK_RECORDS = 9
export const WEEK_DAYS = 6

export const MONTH_COUNTS: Record<Mood, number> = { 安: 7, 喜: 4, 爱: 3, 盼: 2, 思: 2, 烦: 1, 倦: 1 }
export const MONTH_RECORDS = 20
export const MONTH_DAYS = 16
export const MONTH_TOPICS = '散步 8 · 家人 5 · 读书 4 · 其他 3'

export const LETTER = {
  address: '给 2027.10.13 的自己',
  body: ['希望那时的你，仍记得此刻', '窗外的光。', '', '愿你照着自己的步子，', '好好开始，也好好走下去。'],
}

export const COVER = {
  title: '善终 · 让每一个值得记住的日子，都长成一朵花。',
  echo: 'Good Die — memory is light, life is blossom.',
  scope: '全新手机 UI · 13 个界面与状态 · v0.2 艺术系统 · 2026.10.13',
  flows: [
    { heading: '01 · 聊天展示', flow: '今天 → 聊聊 → 发送示例 → 记下' },
    { heading: '02 · 快速记录', flow: '记下 → 可选心情 → 收下 → 回看' },
    { heading: '03 · 近期回望', flow: '近七天 / 近一个月 → 原话与分类数量' },
  ],
  limitation: '点击原型以固定示例演示；文字输入、真实存储和 AI 均未接入。原画与花印直接复用定稿素材，其余为可编辑组件。',
}
