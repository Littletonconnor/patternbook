# RFC 0002: Architecture

## Summary

When an agent adds a file, it decides where the file goes by looking at what is already there and copying the nearest example. If the repository has no rules for where code lives and what may import what, every one of those decisions is a fresh guess, and the guesses drift further apart with each change. People then lose the ability to predict where anything is, and the codebase becomes harder to change safely.

This RFC gives every kind of module one home and fixes the direction imports may point. Code starts next to the one place that uses it and moves to a shared folder only when a second place needs it. Folder and file names say what a module is, so there are no catch-all folders or barrel files. Each rule is enforced by lint or by a structural check, because a rule that lives only in prose is not followed [[3]](#sources) [[11]](#sources).

## Problem

Architecture here means two things: where each piece of code lives, and which code is allowed to import which. Software architecture erodes when actual structure drifts from intended structure. The drift comes from many small changes that each look reasonable, it is usually noticed only through symptoms, and few tools detect it [[2]](#sources). Agents speed it up because they replicate whatever patterns already exist, including poor ones [[3]](#sources). Next.js does not prevent any of this: it leaves organisation to each project and asks only that the project be consistent [[5]](#sources). Nothing makes a project consistent unless a check does.

### Code without a fixed home

When there is no rule for where a kind of module goes, the same kind of module ends up in several places. That costs in three ways.

- **Runtime behaviour.** A helper that cannot be found gets written again. The two copies then diverge, and a fix applied to one leaves the bug in the other.
- **Agents.** An agent places a new file next to whatever it read last. One misplaced file becomes the example the next file copies, so a single exception turns into a pattern.
- **People.** A reader who cannot predict where something lives has to search for it, and cannot tell from a file's location what it is allowed to depend on.

The repository already shows this. `src/components` holds page parts used everywhere, sections used only by the homepage, hooks that read and write browser storage, and an inline script, all in one flat folder. The `/foundations` route keeps its sixteen modules directly beside its `page.tsx`, where they are indistinguishable from route files.

### Imports that can point anywhere

A module hides a design decision from the rest of the system, so that when the decision changes, only that module changes [[1]](#sources). That only works if dependencies point one way. When a design-system button can import lesson data, a change to lesson data can break the button, and the button can no longer be understood on its own.

- **Runtime behaviour.** Two-way dependencies create import cycles. In JavaScript a cycle can leave a value `undefined` at the moment it is read, which fails at runtime, not at compile time [[9]](#sources).
- **Agents.** An agent takes the shortest import path that compiles. Without a rule, the shortest path is often across a boundary.
- **People.** With no direction, a reviewer has to check every new import by hand to see whether it couples two parts that should stay separate.

### Catch-all folders and barrel files

A folder named `utils`, `helpers` or `shared` describes nothing about its contents, so it accepts anything, and the cost of placing a module there is zero. Over time it fills with unrelated code that nothing owns.

A barrel file is an `index.ts` that re-exports everything in a folder, so other code can import from the folder instead of the file. Barrels have three costs:

- **Build and dev speed.** Importing one name through a barrel loads every module the barrel re-exports. In one Next.js project, pages loaded over 11,000 modules and took 5 to 10 seconds to start; removing most internal barrels cut that to about 3,500 modules [[9]](#sources). Next.js added a dedicated optimisation for third-party barrels after measuring 15% to 70% faster development builds without them [[8]](#sources).
- **Hidden cycles.** A file that imports a sibling through its own folder's barrel imports itself indirectly [[9]](#sources).
- **No privacy.** A barrel makes everything in a folder look public, so internal helpers get imported from outside [[9]](#sources).

### Shared code created too early, or too late

Code placed in a shared folder before a second user exists is a guess about reuse, and it moves the code away from the one place that explains it. Code left beside one route after a second route starts importing it becomes a hidden dependency between two routes. Keeping code as close as possible to where it is used, and moving it only when that changes, keeps both mistakes visible [[10]](#sources).

## Goals

1. **Every file has exactly one valid location.** Given what a file is and who imports it, the placement rules in this RFC name one folder. Measured by a structural check that fails on any file in `src` outside an allowed path, once the repository has a test runner.
2. **Imports only point down.** Any import that breaks the direction in part 1 fails `oxlint`. Measured by zero violations on a clean checkout.
3. **No catch-all names and no barrels.** Zero files or folders in `src` named `utils`, `helpers`, `common`, `misc` or `shared`, and zero `index.ts` files.
4. **Route-only code lives with its route.** Every module imported by one route sits in that route's `_parts/` folder. Every module imported by two or more routes sits in `src/components`.
5. **One supported way to do each task.** Base UI is imported only in `src/ui`, `next/link` only in `src/ui/Link`, Lucide only in `src/ui/Icon`, and `localStorage` only in `src/hooks`. Each is enforced by lint.
6. **New modules start in the right place.** Lessons, primitives and diagrams are created by generator commands that write files to the correct folder with the expected shape.

## Proposal

The parts are ordered by how much each one prevents. The import direction comes first because it is fully enforced by lint and stops the most damaging kind of drift, coupling between parts that should stay separate. Fixed homes come next, because they decide where each file goes. Colocation and naming refine those homes. Wrappers and generators make the correct path the easiest one. Enforcement and migration close the RFC.

### 1. Layers and import direction

A layer is a top-level folder in `src` with one role. Layers are stacked by how much of the application each one knows about. Code may import from layers below it and never from layers above, so a lower layer can always be understood, and changed, without reading anything above it [[1]](#sources) [[6]](#sources) [[7]](#sources).

![Layer diagram of src: app at the top, then components, diagrams, ui and hooks, tokens and content, and lib at the bottom. Imports only point down.](assets/0002-layers.svg)

From the bottom up:

- **`lib`**: pure functions with no React and no knowledge of this site. Imports nothing in `src`. It is at the bottom so anything can use it without pulling in anything else.
- **`tokens`**: design values, meaning colours, type, spacing and motion. Imports nothing in `src`. Every visual decision is stored once here, so it sits below everything that draws.
- **`content`**: the catalog, lesson files, glossary, and the functions that query them. May import `lib`. It knows what the site teaches but nothing about how it looks.
- **`ui`**: the design system, generic controls with no knowledge of lessons or routes. May import `tokens`, `lib`, Base UI and Lucide. Keeping it ignorant of the app is what lets it be reused and reviewed on its own, on `/foundations`.
- **`hooks`**: hooks shared by two or more modules, including every read and write of browser storage. May import `content` and `lib`.
- **`diagrams`**: the diagram kit. May import `tokens`, `ui`, `lib` and `hooks`.
- **`components`**: page parts shared by two or more routes. May import every layer above this line.
- **`app`**: routes and Next.js special files. May import everything. A route's `_parts/` folder may be imported only by that route.

Two files sit outside the layers because Next.js requires their location: `src/mdx-components.tsx` and the special files inside `app`. Each is a named exception in the lint config.

### 2. One home for each kind of module

```
src/
  app/                 Routes and Next.js special files
    <route>/_parts/    Modules used by that one route
  components/          Page parts shared by two or more routes
    shell/             The frame around every page
    lesson/            Parts of a lesson page
    catalog/           Cards, indexes and thumbnails that list lessons and diagrams
  diagrams/            The diagram kit and its animation hooks
  ui/                  Design system controls
  hooks/               Shared hooks, one per file
  content/             Data and the functions that query it
    lessons/<slug>/    One lesson: its MDX and its diagrams
  tokens/              Design values
  lib/                 Pure functions
lint/                  Local lint rules
scripts/               Repository scripts, such as screenshots and generators
rfc/                   Decisions
```

`components` is split by area because a flat folder stops telling the reader anything once it passes a couple of dozen files, and because the area names say which page each part belongs to. The three areas match how the site is built: the shell around every page, the parts of a lesson, and the parts that list lessons and diagrams. A new area needs a new RFC, so areas do not multiply.

Folders under `app` that are not routes start with an underscore. Next.js treats an underscore folder as private and never turns it into a URL, so route-only code can sit beside its route safely [[5]](#sources).

### 3. Colocation and promotion

Code starts as close as possible to the one place that uses it, and moves out only when a second place needs it [[10]](#sources).

- **A module used by one route** lives in that route's `_parts/` folder. When a second route imports it, it moves to `components/<area>` in the same change. Because `_parts` may only be imported by its own route, the second import fails lint until the move is made, so the promotion cannot be forgotten.
- **A hook used by one component** stays in that component's file. When a second module needs it, it moves to `src/hooks` as `useThing.ts`. Animation hooks live in `src/diagrams`, because nothing else should animate.
- **A lesson's diagrams** live in that lesson's folder. A diagram reused by a second lesson moves into the kit.
- **New work adds files** instead of editing shared ones. A lesson is a folder, and whether it is written is derived from its MDX file existing, not from a flag kept in sync by hand [[11]](#sources).

### 4. Names that say what a module is

- **`PascalCase.tsx`** exports one component named after the file. **`camelCase.ts`** is any other module. A file can then be found from the name of the thing it exports.
- **No catch-all names.** No file or folder is named `utils`, `helpers`, `common`, `misc` or `shared`. A helper is named after what it does and placed in the layer it belongs to.
- **No barrel files.** Every import names the file it comes from. This keeps imports fast, keeps cycles visible, and keeps modules that are not imported from outside effectively private [[8]](#sources) [[9]](#sources).

### 5. One supported way to do each task

When the same job can be done two ways, agents use both, and the codebase carries two behaviours where there should be one. For each common task there is one module that does it, and the underlying library is imported nowhere else:

- **Links** go through `src/ui/Link` or `ButtonLink`, never `next/link` directly, so every link gets the same styling and focus behaviour.
- **Base UI** is imported only inside `src/ui`. Everything else uses the wrapped control.
- **Icons** render through `<Icon>`, so stroke width and size come from one place.
- **Browser storage** is read and written only in `src/hooks`, so each stored value has exactly one writer and one format [[11]](#sources).

### 6. Generators

The fastest way to add something should also be the correct way [[11]](#sources). Three commands create new modules with the right location, name and shape:

- `new:primitive Name` creates `src/ui/Name.tsx` and its section on `/foundations`.
- `new:lesson slug` creates `src/content/lessons/slug/index.mdx`.
- `new:diagram slug Name` creates a diagram inside the lesson's folder.

When a convention changes, its generator changes in the same commit, so new code never starts from an old pattern.

### 7. Enforcement

Every rule above is checked by a tool. Describing the structure in prose does not make agents follow it [[12]](#sources); failing the build does [[3]](#sources) [[4]](#sources).

- **Import direction and wrappers** use `no-restricted-imports` in one override per layer in `oxlint.config.ts`, as defined in RFC 0004. Each error message names the layer the import should come from or the wrapper to use. The same approach is used by published React architecture guides with `import/no-restricted-paths` [[7]](#sources).
- **File names** use `unicorn/filename-case`, with named overrides for Next.js special files.
- **Barrels and catch-all names** are reported by a small local rule that checks the file path.
- **Placement** is checked by the structural check once a test runner exists. Its failure message says where the file belongs.

### 8. Migration

Moving files changes history and conflicts with work in progress, so the moves happen in one change once in-flight work has landed, and the lint rules land in the same change so the structure cannot drift back.

- `Brand`, `Footer`, `TopBar`, `Sidebar`, `SidebarColumns`, `SidebarToggle`, `PageShell`, `PageIntro`, `PageRail` and `sidebarScript` move to `components/shell/`.
- `LessonLayout`, `LessonHeader`, `LessonEnd`, `Pager`, `Prose`, `Callout`, `CodeBlock`, `CodeTabs`, `Term`, `Table` and `ResourceList` move to `components/lesson/`.
- `LessonCard`, `DiagramCard`, `DiagramIndex`, `DiagramSketch`, `Thumbnail` and `SectionHead` move to `components/catalog/`.
- `HeroDiagram`, `LevelCards` and `TopicList`, used only by the homepage, move to `app/_parts/`.
- `readState`, `sidebarState` and `levelFilter` read and write browser storage, so they become hooks in `src/hooks/`.
- The `/foundations` modules move to `app/foundations/_parts/`.
- `app/ogImage.tsx`, shared by two Open Graph image routes, moves to `components/shell/`.

## Research

### Sources

| #   | Source                                                                                                                                   | Type                           | What it says                                                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [Parnas 1972, On the criteria to be used in decomposing systems into modules](https://www.cse.sc.edu/~mgv/csce590f20/ParnasCriteria.pdf) | Peer-reviewed (CACM)           | Decompose around design decisions likely to change, hiding each in one module, so a change is confined to that module.                             |
| 2   | [Li et al. 2021, Understanding architecture erosion](https://arxiv.org/abs/2103.11392)                                                   | Preprint, practitioner study   | Erosion builds through small changes, is mostly noticed through symptoms, and has few dedicated detection tools.                                   |
| 3   | [Lopopolo 2026, Harness engineering (OpenAI)](https://openai.com/index/harness-engineering/)                                             | Industry report, self-reported | Layered architecture enforced by custom linters and structural tests; agents replicate existing patterns, including poor ones.                     |
| 4   | [Böckeler 2026, Harness engineering](https://martinfowler.com/articles/harness-engineering.html)                                         | Practitioner article           | Structural tests and linters as sensors, with messages written for the agent to act on.                                                            |
| 5   | [Next.js, Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure)                             | Official docs                  | Next.js is unopinionated about organisation; private `_folders` opt out of routing; pick a strategy and be consistent.                             |
| 6   | [Feature-Sliced Design v2.1, Layers](https://feature-sliced.design/docs/reference/layers)                                                | Methodology docs               | Seven standard layers; a module may only import from layers strictly below its own.                                                                |
| 7   | [Bulletproof React, Project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)              | Open-source guide              | Code flows one way (shared, then features, then app), enforced with `import/no-restricted-paths`; no cross-feature imports; import files directly. |
| 8   | [Ding 2023, How we optimized package imports in Next.js (Vercel)](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)   | Industry report                | Barrel imports cost 200 to 800 ms per package; avoiding them gave 15% to 70% faster development builds and about 28% faster production builds.     |
| 9   | [Dorfmeister 2024, Please stop using barrel files](https://tkdodo.eu/blog/please-stop-using-barrel-files)                                | Practitioner article           | Barrels caused 11,000-module page loads, cut to about 3,500 by removing them; they create cycles and remove privacy.                               |
| 10  | [Dodds 2019, Colocation](https://kentcdodds.com/blog/colocation)                                                                         | Practitioner article           | Place code as close to where it is relevant as possible; single-use helpers belong in the file that uses them.                                     |
| 11  | [Dune method write-up](https://github.com/Dahhrk/dark-factory/blob/main/docs/dune-method.md)                                             | Secondary write-up             | The conventional path should take fewer decisions than a shortcut; generators; one writer for each piece of durable state.                         |
| 12  | [Gloaguen et al. 2026](https://arxiv.org/abs/2602.11988)                                                                                 | Peer-reviewed (ICLR)           | Repository overviews in context files did not improve agent results and raised cost.                                                               |
| 13  | [RFC 0001: Agent-first repository](0001-agent-first-repo.md)                                                                             | This repository                | Architecture is the base of the priority pyramid.                                                                                                  |
| 14  | [RFC 0004: Lint](0004-lint.md)                                                                                                           | This repository                | The linter and config that enforce the import rules.                                                                                               |

Speed figures in sources 8 and 9 are self-reported by their authors, from single projects. Source 3 is an industry report whose throughput figures are not used here.

### What we learned

1. Modules work by hiding decisions, which requires dependencies to point one way [1]. Every layered methodology reviewed states the same rule: import only from below [6] [7].
2. Structure erodes through small, locally reasonable changes unless a check catches them, and agents accelerate that by copying what exists [2] [3].
3. Next.js deliberately gives no answer to where code goes [5], so the answer has to come from the project and be enforced by it.
4. Barrel files have measured costs to build speed and correctness in Next.js projects, and the guides that once recommended them now advise importing files directly [7] [8] [9].
5. Code should stay next to its only user until a second user appears [10]. Next.js private folders make that safe inside `app` [5].
6. Describing a structure in prose does not change agent behaviour; enforcing it does [3] [12].

The strongest counter-argument is the Next.js position itself: any organisation works if it is consistent [5]. This RFC agrees, and treats consistency as the thing to enforce, since without enforcement no organisation stays consistent [2].

## Alternatives considered

- **Feature folders** (`features/lessons`, `features/diagrams`, each with its own components and hooks). Popular in application guides, and keeps everything for one feature together [7]. Not chosen because this site is mostly shared presentation over one dataset. The lesson page, the homepage and the diagram index all render the same catalog with the same parts, so most code would belong to several features at once.
- **Full Feature-Sliced Design.** A complete, documented layer system with tooling [6]. Not chosen because its standard layers (entities, features, widgets) describe business-domain apps, and mapping a design system and diagram kit onto them adds names without adding rules.
- **`components/<page>/` instead of `_parts/`.** Keeps every component in one tree. Not chosen because route-only code ends up far from its route, and the folder name does not say who may import it.
- **A flat `components/` folder.** Fewer placement decisions. Not chosen because it mixes page parts, single-route sections and storage hooks today, and will roughly double as lessons and diagrams arrive.
- **`eslint-plugin-boundaries` or `dependency-cruiser`.** Purpose-built for layer rules, with richer reports. Not chosen because `no-restricted-imports` in per-layer overrides covers eight folders with no new dependency and runs inside the single linter from RFC 0004.
- **Keep barrels for `src/ui`.** Shorter imports for the most used folder. Not chosen because the costs in sources 8 and 9 apply to internal folders too, and named file imports keep each control's dependencies visible.

## Tradeoffs and risks

- **Promotion moves files.** Moving a module when a second route needs it adds a file move to a change that was about something else. This is deliberate: the move is the signal that the module became shared.
- **Strict layers can feel indirect.** Code that a lower layer needs from a higher one has to be passed down as a prop or moved down. That is the cost of being able to read each layer on its own.
- **The migration churns history.** One large move makes `git blame` harder to follow. Doing it in a single change, with no other edits, keeps it easy to skip in history.
- **Placement is only partly enforced until tests exist.** Lint catches wrong imports and names, but not a file in the wrong folder that imports nothing wrong.

Revisit if the site gains a second app, if a fourth `components` area is needed, or if lint-based boundaries become too slow or too coarse.
