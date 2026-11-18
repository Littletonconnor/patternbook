# Patternbook TODO

Work top to bottom. Each phase builds on the one before it. Board numbers refer to the design canvas.

## Done

- [x] Scaffold Next.js, StyleX, Base UI, Lucide, fonts
- [x] Tokens and type styles (`src/tokens`)
- [x] ESLint, Prettier, scripts
- [x] `/foundations` page

## 1. Primitives (`src/ui`)

Base UI parts styled with tokens. No app knowledge. Board 04.

- [x] Button (primary, secondary, ghost; sizes)
- [x] IconButton
- [x] Link (inline and standalone)
- [x] Badge (level badges: Foundations, Core, Advanced; kind badges)
- [x] Kbd
- [x] ToggleGroup (used by the level filter and figure controls)
- [x] Tabs (used by code blocks)
- [x] Switch
- [x] Slider
- [x] Tooltip
- [x] Collapsible (used by sidebar topics)
- [x] Drawer (phone menu and sidebar)
- [x] Add a "Primitives" section to `/foundations` showing each one in every state

## 2. Catalog data

The sidebar, homepage and pager all read the same list.

- [x] Source: typed file, `src/content/catalog.ts`
- [x] Types: Topic, Lesson (number, slug, title, level, minutes, status)
- [x] All 16 topics and 83 lessons entered
- [x] Helpers: lesson by slug, previous and next, lessons by level, totals

## 3. App shell

Board 03 shows the shell around a lesson.

- [x] Header / top bar: wordmark, nav links (Lessons, Figures, About), theme hint
- [x] Sidebar: collapsible topics, only the current topic open
- [x] Sidebar: lesson rows with number, title, read tick, current state
- [x] Sidebar: footer count ("16 topics · 83 lessons · 2 read")
- [x] Layout: sidebar + content + "On this page" rail at the measure widths
- [x] Mobile: sidebar becomes a drawer, rail hides
- [x] Footer
- [x] Read state stored in localStorage (no account)

## 4. Homepage

Board 00.

- [x] Hero: headline, two CTAs, the "16 topics / 83 lessons / about 10 hours" line
- [x] Hero figure placeholder (static for now, real figure in phase 6)
- [x] LessonCard component with mini-diagram thumbnail slot
- [x] "Good places to start": the five starter lessons
- [x] Three level cards
- [x] "Everything, by topic" list of all 16 topics

## 5. Lesson components (`src/components`)

Everything a lesson page needs apart from figures. Boards 03 and 04.

- [x] Lesson route: `/lessons/[slug]` with a placeholder body
- [ ] Decide how lessons are written (MDX or TSX)
- [x] Lesson header: topic, number, title, level badge, minutes
- [x] Prose styles: headings, paragraphs, lists, inline code
- [x] Callout
- [x] CodeBlock with tabs and syntax highlighting (Shiki, on the server)
- [x] Term (inline definition)
- [x] Table (trade-offs table)
- [x] "On this page" rail that tracks scroll
- [x] ResourceList ("Go deeper")
- [x] Mark as read
- [x] "Was this lesson useful?" feedback row
- [x] Pager (previous / next)

## 6. Figure kit (`src/figure`)

The part that matters most. Board 02.

- [ ] Decide the animation approach (CSS, Motion, or hand-rolled)
- [ ] Figure frame: title bar, dot-grid stage, actions, readouts, caption
- [ ] Transport: play, pause, step, reset, speed
- [ ] Marks: Record, Node, Packet, Window, Cursor, Fault (hatched), Ghost, Queue
- [ ] Readout and Meter
- [ ] Motion rules wired to the motion tokens; reduced-motion fallback
- [ ] Keyboard and screen reader pass for controls
- [ ] Homepage hero figure (Fig 0.1) built with the kit

## 7. Remaining pages

- [ ] Figures page with kind filter (board 05)
- [ ] About page (board 06)
- [ ] 404 page
- [ ] Metadata, favicon, Open Graph image

## 8. First lesson

Proves the whole system end to end.

- [ ] Lesson 33: Offset vs cursor pagination, full copy
- [ ] Fig 33.1: offset vs cursor race (load next, insert row, delete row, reset)
- [ ] Fig 33.2: meter
- [ ] Real "Go deeper" resources
- [ ] Review on mobile and in dark mode

## 9. Starter set, then the rest

- [ ] 25 Debounce vs throttle
- [ ] 27 Optimistic updates
- [ ] 28 Infinite scroll
- [ ] 73 A container is just a process
- [ ] Lessons 81 to 83: how the figures are built
- [ ] Continue through `CATALOG.md`

## Later

- [ ] Deploy to Vercel
- [ ] Pre-commit hook and CI
- [ ] Search
- [ ] Domain
