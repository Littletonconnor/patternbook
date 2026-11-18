# Patternbook TODO

Work top to bottom. Each phase builds on the one before it. Board numbers refer to the design canvas.

## Done

- [x] Scaffold Next.js, StyleX, Base UI, Lucide, fonts
- [x] Tokens and type styles (`src/tokens`)
- [x] ESLint, Prettier, scripts
- [x] `/foundations` page

## Agent-driven repo

Goal: an agent can pick up any item on this list, put the code in the right place, and know it is done when one command passes. Conventions live in tools, not in prose. `AGENTS.md` only covers what a tool cannot check. Do this before phase 6, so the figure kit is written under the rules from day one.

Rollout: one rule group per change. Add the rule, fix every existing violation in the same change, and finish with `npm run verify` green. Never land a rule as `warn` and leave the warnings.

### A. Architecture in `AGENTS.md`

Keep the Next.js block at the top (`next dev` rewrites it). Add our own section under it.

- [ ] Layer map, and the only allowed import direction:

  | Folder           | Holds                                              | May import                            |
  | ---------------- | -------------------------------------------------- | ------------------------------------- |
  | `src/tokens`     | colours, fonts, space, motion, type styles         | `@stylexjs/stylex` only               |
  | `src/content`    | types, catalog, glossary, lesson MDX               | `src/content`                         |
  | `src/ui`         | Base UI primitives with no app knowledge           | `src/tokens`, Base UI, Lucide         |
  | `src/figure`     | figure kit: frame, transport, marks, readouts      | `src/tokens`, `src/ui`                |
  | `src/components` | page parts that know about lessons and the catalog | `src/tokens`, `src/ui`, `src/content` |
  | `src/app`        | routes, layouts, `/foundations`                    | everything                            |

- [ ] Where a new thing goes: a reusable control is `src/ui`; anything that knows what a lesson is goes in `src/components`; anything drawn on a figure stage goes in `src/figure`; data goes in `src/content`; a new value (colour, size, duration) goes in `src/tokens` first and is used by name.
- [ ] When to write code: one TODO item per change; tick its box in the same change; read the matching design canvas board first; no new dependencies, tokens, or folders without asking Connor.
- [ ] How to write code: named exports, one component per file named after the file, StyleX only, server components by default, `"use client"` only on the leaf that needs it, a new primitive also gets a row on `/foundations` in every state.
- [ ] Definition of done: `npm run verify` passes, the box is ticked, and for UI work the page was looked at in light and dark at phone and desktop width (see `npm run shots`).

### B. Scripts

Scripts that exist: `lint`, `typecheck`, `format`, `format:check`, `check`.

- [ ] `verify`: the one gate agents run. `format:check`, then `lint`, then `typecheck`, then `test`. Replaces `check` (keep `check` as an alias or delete it).
- [ ] `verify:full`: `verify` plus `next build`. Run before a commit that touches routes, config or MDX.
- [ ] `lint`: add `--max-warnings 0`, so a warning fails like an error.
- [ ] `lint:fix`: `eslint . --fix`, then `prettier --write .`
- [ ] `test`: unit tests (Vitest, needs Connor to install). First tests: catalog integrity (slugs unique, numbers 1 to 83 with no gaps, every topic has lessons, previous and next wrap correctly, starter lessons exist), glossary terms unique, and the custom lint rules (section D).
- [ ] `test:rules`: only the lint rule tests, so changing a rule is fast to check.
- [ ] `shots`: Playwright script that screenshots `/`, `/foundations` and one lesson in light and dark at 390px and 1280px into `.shots/` (git-ignored). This is how an agent checks its UI change without a person.
- [ ] Optional: `knip` for unused files, exports and dependencies, run inside `verify`.

### C. Verification checks

Where each check runs, cheapest first.

- [ ] Claude Code hooks, committed in `.claude/settings.json`:
  - After every Edit or Write of a `src` file: run `eslint --fix` and `prettier --write` on that file and show the agent what is left. Mistakes surface while the agent is still in the file.
  - On Stop: run `npm run verify`. If it fails, the agent is told to keep going instead of finishing.
- [ ] Pre-commit hook (`simple-git-hooks` + `lint-staged`, or husky): prettier and eslint on staged files only. Fast, so it never gets skipped.
- [ ] CI on every push and PR (GitHub Actions): `npm ci`, `npm run verify:full`. Branch protection on `main` once it is green.
- [ ] Content checks inside `test`: every lesson marked written in `catalog.ts` has an MDX file, and every MDX file has a catalog entry.

### D. Lint rules

Most of the conventions so far are things Connor has said once. Each one below becomes a rule whose error message tells the agent what to do instead (for example: "Raw fontSize. Use a style from `type` in `@/tokens/typography`."). That message is the documentation.

How they are built, cheapest first:

1. Core ESLint options and rules (`linterOptions`, `no-restricted-imports`, `no-restricted-syntax` with AST selectors). No new dependencies.
2. Rules from plugins already installed: `@stylexjs/eslint-plugin`, `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-jsx-a11y`, `@typescript-eslint`.
3. A small local plugin in `eslint/` (`eslint/patternbook.mjs`, one file per rule in `eslint/rules/`) for anything a selector cannot express. Each rule gets `RuleTester` cases in `eslint/rules/*.test.ts`.

Keep the selector lists in their own file (`eslint/restricted.mjs`), one entry per rule with its message, so `eslint.config.mjs` stays short.

#### D1. No escape hatches (do first, or every other rule can be switched off)

- [ ] `linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: "error" }` for `src/**`. An `// eslint-disable` comment does nothing. Any exception is a `files` override in `eslint.config.mjs`, where Connor sees it.
- [ ] `@typescript-eslint/ban-ts-comment`: no `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`.
- [ ] `--max-warnings 0` (section B).

#### D2. No comments in code

- [ ] Local rule `patternbook/no-comments`: reports every comment from `sourceCode.getAllComments()` in `src/**`, which covers `//`, `/* */`, `/** */` and JSX `{/* */}`. Message: "No comments. Rename, extract a function or a constant until the code says it." Not auto-fixable, so the agent has to decide what the comment was for.
- [ ] Scope: `src/**` only. Config files at the root may keep comments.
- [ ] Decide: are `/** */` prop docs allowed in `src/ui`? Recommendation: no, prop names and types carry it.
- [ ] Fix the current ones. Today: `src/ui/Slider.tsx`, `src/ui/ButtonLink.tsx`, `src/content/types.ts`, `src/app/foundations/Link.tsx`, `src/app/foundations/StateMatrix.tsx`, `src/components/home/HeroFigure.tsx`, `src/components/home/Thumbnail.tsx`, `src/components/SidebarColumns.tsx` (about 20 comments).

#### D3. Typography only from `typography.ts`

- [ ] `no-restricted-syntax` on style properties `fontSize`, `lineHeight`, `fontWeight`, `letterSpacing`, `fontFamily` whose value contains a literal (`Property[key.name=/^(fontSize|lineHeight|fontWeight|letterSpacing|fontFamily)$/] Literal`), everywhere except `src/tokens/typography.ts`.
- [ ] Same for SVG attributes in JSX: `JSXAttribute[name.name=/^font(Size|Weight|Family)$/]`.
- [ ] Decide how weight changes are written. `fontWeight: 500` for selected and current states appears in `src/ui/Link.tsx`, `Tabs.tsx`, `ToggleGroup.tsx`, `Collapsible.tsx`, and in `foundations/Section.tsx`, `foundations/Colour.tsx`, `home/HeroFigure.tsx`, `home/TopicList.tsx`. Recommendation: export `weight` (regular, medium, semibold) from `typography.ts` and allow `fontWeight: weight.medium`.

#### D4. Colours only from tokens

- [ ] `no-restricted-syntax` on string literals that look like a colour (`#rgb`, `#rrggbb`, `rgb(`, `hsl(`, `oklch(`) outside `src/tokens/**`.
- [ ] Named colours (`"white"`, `"black"`, `"red"`) in `color`, `backgroundColor`, `borderColor`, `fill`, `stroke` and the matching JSX attributes. Allowed: `transparent`, `currentColor`, `inherit`.
- [ ] Fix: the two `themeColor` hex values in `src/app/layout.tsx` move to a plain export in `src/tokens`.
- [ ] Decide: should meaning colours (signal, focus, fault, sound) stay figure-only? Today `focus` is used for focus rings (23 times), and signal, fault and sound appear in Badge, Link, Callout, CodeBlock, Sidebar, Brand, ResourceList, LessonEnd. If the rule is wanted, it is a `MemberExpression[object.name="colors"][property.name=/^(signal|fault|sound)/]` selector allowed only in `src/figure/**` and named exceptions, with `focus` kept for focus rings.

#### D5. Tokens for the rest (turn on as each token set lands)

- [ ] Spacing: literal numbers in `padding*`, `margin*`, `gap`, `inset*` must use `space.*`. About 95 raw values against 109 token uses today, so this waits for the spacing pass (deferred). Allow `0`.
- [ ] Radius, border width, shadow: same pattern once tokens exist.
- [ ] Motion: literal durations and easings in `transition*` and `animation*` must use motion tokens (phase 6).
- [ ] Media queries: literal `"@media ..."` keys are only allowed in `src/tokens`. Everything else imports the breakpoint constant.

#### D6. Architecture and imports

- [ ] Layer boundaries from the table in section A with `no-restricted-imports` `patterns` inside a `files` block per folder. Example: in `src/ui/**`, ban `@/components/*`, `@/figure/*`, `@/content/*`, `@/app/*` with "src/ui has no app knowledge. Pass it in as a prop." No violations today, so this locks in what is already true. (`eslint-plugin-boundaries` is the plugin version if the patterns get unwieldy.)
- [ ] Always the `@/` alias: ban `../*` imports. `./` in the same folder is fine. No violations today.
- [ ] Base UI only in `src/ui`: ban `@base-ui/react/*` elsewhere. One violation: `src/components/LessonEnd.tsx` imports `Toggle` directly; route it through a `src/ui` part.
- [ ] Icons only through `<Icon>`: local rule `patternbook/icon-through-wrapper` that reports a JSX element whose name was imported from `lucide-react`, outside `src/ui/Icon.tsx`. Importing the glyph to pass as `icon={X}` stays allowed.
- [ ] Links through `src/ui/Link` or `ButtonLink`: ban `next/link` outside those two files. Eight files outside those two import it directly today; decide whether page parts may.
- [ ] No CSS files: ban `*.css` imports except `globals.css` in `src/app/layout.tsx`. StyleX only.
- [ ] No `style={...}` and no `className=` in JSX outside `src/app/layout.tsx`. Dynamic values use StyleX dynamic styles.

#### D7. StyleX

- [ ] `@stylexjs/no-unused` from `warn` to `error`.
- [ ] Turn on `@stylexjs/valid-shorthands` (no `margin: "0 4px"`, use the longhands), `@stylexjs/sort-keys`, `@stylexjs/enforce-extension` (variables only in `*.stylex.ts`), `@stylexjs/no-conflicting-props`, `@stylexjs/no-legacy-contextual-styles`. All ship in the installed plugin.
- [ ] One `stylex.create` per file, named `styles`, at the bottom or top (pick one). Selector on `CallExpression[callee.property.name="create"]` counts, or a local rule.

#### D8. React, Next and TypeScript

- [ ] Named exports only: `import/no-default-export` everywhere, with an override for Next special files in `src/app` (`page`, `layout`, `not-found`, `error`, `loading`, `manifest`, `icon`, `opengraph-image`, `sitemap`, `robots`) and root config files.
- [ ] File names: `PascalCase.tsx` for components, `camelCase.ts` for modules. `unicorn/filename-case` (new dependency) or a local rule.
- [ ] Component name matches file name: local rule `patternbook/export-matches-filename` for `.tsx` files in `src/ui`, `src/components`, `src/figure`.
- [ ] Unneeded `"use client"`: local rule that warns when a file has the directive but no hook call, no `on*` JSX handler, and no `window`, `document` or `localStorage`. Keeps the client bundle small as the figure kit grows.
- [ ] `@typescript-eslint/consistent-type-imports`, `consistent-type-definitions: ["error", "type"]` (no `interface` today, keep it that way), `no-non-null-assertion`, `no-explicit-any` as `error`.
- [ ] Ban `enum` and `namespace` (`TSEnumDeclaration`, `TSModuleDeclaration` selectors). Use unions and modules.
- [ ] `no-console` as `error`. `eqeqeq`, `prefer-const`, `no-nested-ternary`.
- [ ] Optional: `max-lines` around 250 per file as a nudge to split.

#### D9. Copy and accessibility

- [ ] UI copy says "topics", never "tracks": `JSXText` and string `Literal` matching `/\btracks?\b/i` in `src/app` and `src/components`. Message says use "topics".
- [ ] `jsx-a11y` strict preset on top of what `eslint-config-next` turns on.
- [ ] `<Icon>` with no `label` must sit inside something with an accessible name (local rule, or check in the `/foundations` review).

#### D10. Keeping the rules honest

- [ ] Every local rule has `RuleTester` cases: at least one valid and one invalid example taken from real code in this repo.
- [ ] A rule-change checklist in `AGENTS.md`: update the message, add a test case, fix the code in the same change.
- [ ] Rules apply to code from the other in-flight work too. Turn each one on after that work lands, not around it.

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
- [ ] Search
- [ ] Domain
