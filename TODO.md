# Patternbook TODO

Open work first, roughly in the order to do it. Finished phases are under [Done](#done) at the bottom. Board numbers refer to the design canvas.

## Shadows

The current set in `src/tokens/tokens.stylex.ts` is three one-off values (`thumb`, `popover`, `sheet`), and none have dark mode values.

- [ ] Design a shadow scale (for example raised, overlay, sheet) with light and dark values
- [ ] Replace the current tokens and update `Switch`, `Tooltip` and `Drawer`
- [ ] Add a "Shadows" section to `/foundations` showing each level

## Branding

The current mark (a dot-grid square with an orange dot) and the "Patternbook" wordmark were placeholders. Replace them with something more professional.

- [ ] Design a new logo: mark and wordmark, light and dark versions
- [ ] Update `Brand` in the top bar to use it
- [ ] New favicon and app icons from the mark (`src/app/favicon.ico`, `manifest.ts`)
- [ ] New Open Graph image (`OgCard`, site and lesson `opengraph-image.tsx`)

## 6. Diagram kit (`src/diagrams`)

The part that matters most. Board 02.

- [ ] Decide the animation approach (CSS, Motion, or hand-rolled)
- [ ] Diagram frame: title bar, dot-grid stage, actions, readouts, caption
- [ ] Transport: play, pause, step, reset, speed
- [ ] Marks: Record, Node, Packet, Window, Cursor, Fault (hatched), Ghost, Queue
- [ ] Readout and Meter
- [ ] Motion rules wired to the motion tokens; reduced-motion fallback
- [ ] Keyboard and screen reader pass for controls
- [ ] Homepage hero diagram (Diagram 0.1) built with the kit

## Sidebar redesign

The current sidebar doesn't work well yet. Decide what to change before building.

- [ ] Review the current sidebar and list what isn't working
- [ ] New design on the canvas (board 03)
- [ ] Build it. Collapse buttons use `src/ui` parts instead of custom styles

## 8. First lesson

Proves the whole system end to end.

- [ ] Lesson 33: Offset vs cursor pagination, full copy
- [ ] Diagram 33.1: offset vs cursor race (load next, insert row, delete row, reset)
- [ ] Diagram 33.2: meter
- [ ] Real "Go deeper" resources
- [ ] Review on mobile and in dark mode

## 9. Starter set, then the rest

- [ ] 25 Debounce vs throttle
- [ ] 27 Optimistic updates
- [ ] 28 Infinite scroll
- [ ] 73 A container is just a process
- [ ] Lessons 81 to 83: how the diagrams are built
- [ ] AI topic (84 to 87). Lesson 87, Agent-first repositories, turns the `rfc/` documents into interactive diagrams
- [ ] Continue through `src/content/catalog.ts`

## Agent-driven repo

Design and reasoning: [RFC 0001: Agent-first repository](rfc/0001-agent-first-repo.md). Each sub-section below matches a layer of the RFC's priority pyramid, from most to least deterministic. Each sub-section links to its layer's RFC. Sub-sections stay empty until the implementation details are agreed.

### 1. Architecture

Design: [RFC 0002: Architecture](rfc/0002-architecture.md).

- [x] Layers and import direction, enforced by per-layer `no-restricted-imports`
- [x] Folder moves: route-only code in `_parts/`, shared parts in `components/{shell,lesson,catalog}`, shared hooks in `src/hooks`
- [x] One way to do each task: Base UI and `next/link` only in `src/ui`, icons through `<Icon>`, browser storage only in `src/hooks`
- [x] Names: no barrel files, no catch-all names, `PascalCase.tsx` / `camelCase.ts`
- [x] File and function size limits, oversized files split
- [x] Structure check (`npm run structure`, part of `verify`)
- [x] Generators: `new:primitive`, `new:lesson`, `new:diagram`, `new:page`, `new:rule`, `new:rfc`, `promote`

### 2. Types

Design: [RFC 0003: Types](rfc/0003-types.md).

### 3. Lint rules

Design: [RFC 0004: Lint](rfc/0004-lint.md).

- [x] Oxlint with every rule named, categories off, type-aware, errors only
- [x] Next.js, accessibility and StyleX rules
- [x] Disable comments caught: unused directives fail, `lint:directives` grep in `verify`
- [x] Local rules: no comments, no `enum`, colours and type only from tokens, effects and timers only inside hooks
- [ ] Spacing ratchet (after spacing tokens)
- [ ] Switch Prettier to oxfmt

### 4. Tests

Design: [RFC 0005: Tests](rfc/0005-tests.md).

### 5. Runtime verification

Design: [RFC 0006: Runtime verification](rfc/0006-runtime-verification.md).

### 6. Prose

Design: [RFC 0007: Prose](rfc/0007-prose.md).

## Testing

Not started. Everything that needs a test runner lives here, so the rest of the list can land without one. When this section starts, `test` joins `verify`.

- [ ] Set up Vitest (Connor installs it). Tests sit next to their file as `Foo.test.ts`. No module mocking (`vi.mock`): use real seams.
- [ ] `test` script: all unit tests. `test:rules`: only the lint rule tests, so changing a rule is fast to check.
- [ ] Catalog integrity: slugs unique, numbers 1 to 83 with no gaps, every topic has lessons, previous and next wrap correctly, starter lessons exist. Glossary terms unique.
- [ ] Content checks: every lesson marked written in `catalog.ts` has an MDX file, and every MDX file has a catalog entry.
- [ ] Local lint rules: `RuleTester` cases in `lint/rules/*.test.ts`, at least one valid and one invalid example taken from real code in this repo.
- [ ] Structure test: every file in `src` sits in an allowed path, and the failure message says where it belongs.
- [ ] `AGENTS.md` files: line limits, and every file path they mention exists.

## Later

- [ ] Deploy to Vercel
- [ ] Search
- [ ] Domain

## Done

### Foundations

- [x] Scaffold Next.js, StyleX, Base UI, Lucide, fonts
- [x] Tokens and type styles (`src/tokens`)
- [x] Lint (Oxlint, replaced ESLint), Prettier, scripts
- [x] `/foundations` page

### 1. Primitives (`src/ui`)

Base UI parts styled with tokens. No app knowledge. Board 04.

- [x] Button (primary, secondary, ghost; sizes)
- [x] IconButton
- [x] Link (inline and standalone)
- [x] Badge (level badges: Foundations, Core, Advanced; kind badges)
- [x] Kbd
- [x] ToggleGroup (used by the level filter and diagram controls)
- [x] Tabs (used by code blocks)
- [x] Switch
- [x] Slider
- [x] Tooltip
- [x] Collapsible (used by sidebar topics)
- [x] Drawer (phone menu and sidebar)
- [x] Add a "Primitives" section to `/foundations` showing each one in every state

### 2. Catalog data

The sidebar, homepage and pager all read the same list.

- [x] Source: typed file, `src/content/catalog.ts`
- [x] Types: Topic, Lesson (number, slug, title, level, minutes, status)
- [x] All 16 topics and 83 lessons entered
- [x] Helpers: lesson by slug, previous and next, lessons by level, totals

### 3. App shell

Board 03 shows the shell around a lesson.

- [x] Header / top bar: wordmark, nav links (Lessons, Diagrams, About), theme hint
- [x] Sidebar: collapsible topics, only the current topic open
- [x] Sidebar: lesson rows with number, title, read tick, current state
- [x] Sidebar: footer count ("16 topics · 83 lessons · 2 read")
- [x] Layout: sidebar + content + "On this page" rail at the measure widths
- [x] Mobile: sidebar becomes a drawer, rail hides
- [x] Footer
- [x] Read state stored in localStorage (no account)

### 4. Homepage

Board 00.

- [x] Hero: headline, two CTAs, the "16 topics / 83 lessons / about 10 hours" line
- [x] Hero diagram placeholder (static for now, real diagram in phase 6)
- [x] LessonCard component with mini-diagram thumbnail slot
- [x] "Good places to start": the five starter lessons
- [x] Three level cards
- [x] "Everything, by topic" list of all 16 topics

### 5. Lesson components (`src/components`)

Everything a lesson page needs apart from diagrams. Boards 03 and 04.

- [x] Lesson route: `/lessons/[slug]` with a placeholder body
- [x] Decide how lessons are written: MDX (deps installed: `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`)
- [x] Wire up MDX: `@next/mdx` in `next.config.ts`, `mdx-components.tsx` mapping headings, paragraphs, lists, code and tables to the Prose parts and CodeBlock
- [x] Lesson route renders the MDX file for a slug, falling back to the "Coming soon" body when none exists. A lesson is `src/content/lessons/<slug>/index.mdx` plus one line in `src/content/lessons/registry.ts`
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

### 7. Remaining pages

- [x] Diagrams page with kind filter (board 05)
- [x] About page (board 06)
- [x] 404 page
- [x] Metadata, favicon, Open Graph image
