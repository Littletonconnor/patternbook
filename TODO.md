# Patternbook TODO

Open work first, roughly in the order to do it. Finished phases are under [Done](#done) at the bottom. Board numbers refer to the design canvas.

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

Design: [RFC 0002: Architecture](rfc/0002-architecture.md). Done, see [Agent-driven repo: Architecture](#agent-driven-repo-architecture) under Done.

### 2. Types

Design: [RFC 0003: Types](rfc/0003-types.md). Done, see [Agent-driven repo: Types](#agent-driven-repo-types) under Done.

### 3. Lint rules

Design: [RFC 0004: Lint](rfc/0004-lint.md). Done, see [Agent-driven repo: Lint rules](#agent-driven-repo-lint-rules) under Done.

### 4. Tests

Design: [RFC 0005: Tests](rfc/0005-tests.md). Done, see [Agent-driven repo: Tests](#agent-driven-repo-tests) under Done. What waits until the site needs it is in [Tests for later](#tests-for-later).

### 5. Runtime verification

Design: [RFC 0006: Runtime verification](rfc/0006-runtime-verification.md).

### 6. Prose

Design: [RFC 0007: Prose](rfc/0007-prose.md).

## Later

- [ ] Deploy to Vercel
- [ ] Search
- [ ] Domain

## Done

### Foundations

- [x] Scaffold Next.js, StyleX, Base UI, Lucide, fonts
- [x] Tokens and type styles (`src/tokens`)
- [x] Lint (Oxlint, replaced ESLint), oxfmt (replaced Prettier), scripts
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

### Agent-driven repo: Architecture

Design: [RFC 0002: Architecture](rfc/0002-architecture.md).

- [x] Layers and import direction, enforced by per-layer `no-restricted-imports`
- [x] Folder moves: route-only code in `_parts/`, shared parts in `components/{shell,lesson,catalog}`, shared hooks in `src/hooks`
- [x] One way to do each task: Base UI and `next/link` only in `src/ui`, icons through `<Icon>`, browser storage only in `src/hooks`
- [x] Names: no barrel files, no catch-all names, `PascalCase.tsx` / `camelCase.ts`
- [x] File and function size limits, oversized files split
- [x] Structure check (`npm run structure`, part of `verify`)
- [x] Generators: `new:primitive`, `new:lesson`, `new:diagram`, `new:page`, `new:rule`, `new:rfc`, `promote`

### Agent-driven repo: Lint rules

Design: [RFC 0004: Lint](rfc/0004-lint.md).

- [x] Oxlint with every rule named, categories off, type-aware, errors only
- [x] Next.js, accessibility and StyleX rules
- [x] Disable comments caught: unused directives fail, `lint:directives` grep in `verify`
- [x] Local rules: no comments, no `enum`, colours and type only from tokens, effects and timers only inside hooks, storage, cookies and clipboard only through `src/hooks`
- [x] Spacing ratchet (`npm run spacing`, part of `verify`)
- [x] Switch Prettier to oxfmt, with import sorting

### Agent-driven repo: Types

Design: [RFC 0003: Types](rfc/0003-types.md).

- [x] Compiler options beyond `strict`: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `verbatimModuleSyntax`, `erasableSyntaxOnly`; `allowJs` off
- [x] Catalog written `as const satisfies`, with `LessonSlug` and `TopicSlug` derived from it. Every topic has at least one lesson (non-empty tuple types)
- [x] Slug unions used everywhere a slug goes: lesson registry, diagrams, thumbnails, topic icons (`Record<TopicSlug, …>`), sidebar, read state
- [x] Boundaries narrowed: route params and pathnames through `isLessonSlug`, stored read state filtered to known slugs, `isArray` in `src/lib` instead of `Array.isArray` (which narrows to `any[]`)
- [x] Typed links: `typedRoutes: true`, link primitives generic over the route, MDX links must point at a lesson, a `#heading` or an `https://` URL
- [x] `typecheck` runs `next typegen` first, so a clean checkout type-checks without a build
- [x] Lint: no unnecessary conditions, function properties instead of method signatures, `fetch` banned outside a client module, `?: T | undefined` only in `<Name>Props` types
- [x] TypeScript pinned to an exact version
- [x] Type coverage at 100% (`npm run typecheck:coverage`, strict mode, part of `verify`)

### Agent-driven repo: Tests

Design: [RFC 0005: Tests](rfc/0005-tests.md), with placement from [RFC 0002 part 5](rfc/0002-architecture.md#5-where-tests-live).

- [x] Vitest (Node, random order, no retries, no `.only`, mocks and globals restored after each test). `test` runs once, `test:related` runs the tests for changed files, `test:rules` runs only the lint rule tests
- [x] `test` and `test:count` are the last steps of `verify`
- [x] Playwright end-to-end tests in `e2e/<journey>.e2e.ts` (`npm run test:e2e`, builds and starts the site, `.only` forbidden, no retries): reading lessons in order, the not found page, and the level filter
- [x] Lint for tests: no focused, skipped or commented-out tests, every test asserts, no conditional assertions, no module mocks, no snapshots, one runner, test files named `*.test.ts`, `*.test.tsx` or `*.test.mts`
- [x] Lint for placement: shipped code can't import tests, `*.fixture.*` or `src/testing`; tests follow their folder's import rules; `src/testing` may import any layer; `e2e/` imports nothing from `src`
- [x] Structure check: a test needs a source file of the same name beside it, `.e2e.ts` files live in `e2e/`, fixtures sit beside a test or in `src/testing`; tests and fixtures are skipped by the route, `_parts` and area size checks. Split into pure functions (`scripts/structure.mts`, `scripts/testPlacement.mts`) with tests
- [x] Spacing check split the same way (`scripts/spacing.mts`), with tests; test files don't count toward it
- [x] Test-count ratchet: a Vitest reporter records the count, `test:count` fails if it drops below `scripts/testCountBaseline.json` and raises the baseline when it grows
- [x] Every local lint rule has `RuleTester` tests with accepted and rejected samples and the exact message (shared tester in `lint/rules/ruleTester.fixture.mts`)
- [x] `new:rule` also creates the rule's test file
- [x] Data invariants: lesson numbers 1 to N with no gaps, unique slugs, topics and lessons agree, starter lessons exist, diagrams numbered after their lesson, glossary terms unique, every lesson folder registered and every published lesson has a source
- [x] Logic: `formatMinutes`, `lessonSlugFromPath`, `neighbours`, `totals`, `headingId`, generator name and insert helpers
- [x] Component tests in a real browser: `*.test.tsx` runs as a separate Vitest project in Chromium through Playwright, with StyleX compiled by `@stylexjs/unplugin`. Storage, cookies, the sidebar state on `<html>`, scroll and the 1280×800 viewport reset before each test (`src/testing/browserSetup.ts`)
- [x] Component tests for every component with behaviour of its own: mark as read and feedback, the sidebar (current topic open, links for published lessons, level filter and its empty state, collapse all, read counts), code tabs (switching and copying), the page rail (current heading while scrolling, hidden below 1180px), lesson cards (details and the Read badge), the diagram index filter, the top bar (current section, phone menu) and hiding, showing and resizing the sidebar (button, `⌘\`, keyboard). The `src/ui` wrappers are covered through these rather than on their own
- [x] `AGENTS.md` check (`npm run agents`, in `verify`): at most 150 lines, and every file path mentioned in a code span exists next to the file or at the repository root
- [x] Unknown lesson URLs: kept at status 200 (the page streams before the slug is checked), with an end-to-end test that the not found page carries `noindex`
- [x] Parser tests in `src/hooks` for the stored read lessons, level filter and sidebar state: accepted and rejected examples, plus property-based tests (fast-check) that any stored value parses to a valid result or to nothing, and that every value written reads back unchanged. `clampWidth` always gives a whole number within the limits

### Shadows

Three levels (`raised`, `overlay`, `sheet`) with light and dark values, plus `surfaceRaised` and `surfaceOverlay` for dark mode. Board 01, section 04.

- [x] Design a shadow scale (for example raised, overlay, sheet) with light and dark values
- [x] Replace the current tokens and update `Switch`, `Tooltip` and `Drawer`
- [x] Add a "Shadows" section to `/foundations` showing each level

### Branding

A 3 by 3 dot grid with one signal dot off the grid, and a lowercase "patternbook" wordmark. Board 01, section 05.

- [x] Design a new logo: mark and wordmark, light and dark versions
- [x] Update `Brand` in the top bar to use it
- [x] New favicon and app icons from the mark (`src/app/favicon.ico`, `manifest.ts`)
- [x] New Open Graph image (`OgCard`, site and lesson `opengraph-image.tsx`)

## Tests for later

Parts of [RFC 0005: Tests](rfc/0005-tests.md) that apply once the site has the code they test.

- [ ] Route handler tests, beside each `route.ts`, once the site has one: call the handler with a real `Request` and check the status, headers and body
- [ ] Database tests, once the site stores data: a throwaway database of the same engine (Testcontainers), and each test starts from a known state by resetting the tables or rolling back a transaction
- [ ] External API tests, once the site calls one: Mock Service Worker intercepts requests under `fetch`, so the real client runs against responses saved from the real API (`*.fixture.json`), and unhandled requests fail the test
- [ ] Mutation testing (Stryker), run on demand or on changed files, starting with the parsers in `src/hooks` and the catalog invariants. Each surviving change becomes a new test
