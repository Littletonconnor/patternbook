# RFC 0001: Agent-first repository

## Summary

An agent-first repository is one where the cheapest way for an agent to make a change is also the correct way, and where a wrong change fails before anyone reviews it. This RFC orders the ways of achieving that by how deterministic they are. Architecture comes first, then types, lint rules, tests, and runtime verification. Prose instructions come last, for judgment calls only. Most of the effort goes into the bottom layers, because they fail the build, run earliest, and cannot be skipped. Every correction that has to be made twice is pushed down to the lowest layer that can catch it.

## Problem

Coding agents act on three inputs: the files they open, the nearest existing example, and the feedback their tools return. A convention that is not part of one of those inputs is not reliably followed.

Instructions in context files are model context, not constraints. Compliance is not guaranteed, and adherence drops as files grow [[20]](#sources). In a controlled study across several agents, context files did not generally raise task success while raising inference cost by over 20% [[8]](#sources). The same holds for people: static analysis results shown outside the normal workflow go unused, and warnings get ignored [[4]](#sources).

Agents also replicate whatever patterns already exist in a codebase, including poor ones, so every unenforced convention drifts further with each change [[10]](#sources). This repository already shows that drift. Comments, hand-written design values, imports across intended boundaries, and modules in the wrong folder all exist today, and the lint config has no rules that would catch any of them. There is also no single command that defines when a change is done.

## Goals

Each goal states an outcome and how it is measured. All of them hold on a clean checkout once the change that introduces them has landed.

1. **Every convention is mechanically enforced or explicitly marked as judgment.** Measured by the rule table in the root `AGENTS.md`: each row names its enforcing check, or is labelled "judgment" with the reason no check is possible. No convention exists only in chat, memory, or review comments.
2. **One command defines done, and it is clean.** `npm run verify` exits 0 with zero errors and zero warnings. A change is not done until it does, and no other command is needed to know.
3. **Feedback arrives inside the edit that caused it.** The per-file hook reports violations for the edited file in a few seconds. The full `verify` run stays under about 60 seconds without `next build`. If either budget is exceeded, the hook or gate is restructured, not skipped.
4. **Checks cannot be bypassed from the code.** Zero lint disable directives, zero `@ts-` directives, and zero non-`const` type assertions in `src`. Every exception is a named override in the lint config, so the full list of exceptions is reviewable in one file.
5. **File placement is deterministic.** Given a file's kind and its importers, the placement table yields exactly one location. Any import that breaks the layer direction fails lint. Once testing lands, any file outside the allowed paths fails the structure check.
6. **Design values have a single source.** Zero literal colours, font sizes, weights, line heights, letter spacings or font families outside `src/tokens`. The count of raw spacing values never increases, and reaches zero when spacing tokens land.
7. **Context stays within a budget and carries only instructions.** The root `AGENTS.md` stays under about 80 lines and each local file under about 30. None of them describe what files contain or repeat a rule a check already enforces.
8. **UI changes are verified on rendered output.** A UI change is done only with screenshots at phone and desktop width in light and dark. Every diagram has a scripted drive that exercises its controls and saves evidence of each state.
9. **Repeated mistakes stop repeating.** A mistake corrected twice gets a control at the most deterministic layer that works, and that control fails on the original mistake. The number of prose-only rules does not grow over time.
10. **Structural decisions are traceable.** Every new dependency, top-level folder, or rule group links to the RFC that justified it.

## Non-goals

- **Tests now.** No test runner yet. Tests are designed once the other layers are in place.
- **Choosing the linter.** The linter and its base rule set are decided in [RFC 0002](0002-oxlint.md).
- **Adopting third-party kits.** Published agent plugins and rule sets are sources of patterns, not dependencies.
- **Unattended agent loops or auto-merge.** Review and commits stay manual.
- **Spacing tokens.** The spacing pass is deferred. This RFC only stops raw values from growing.
- **Area prefixes on commit titles** (`ui:`, `diagrams:`). Cheap to add later if history gets hard to scan.

## The priority pyramid

![Priority pyramid: architecture at the base, then types, lint rules, tests, runtime verification, and prose at the top](assets/0001-pyramid.svg)

The layers are ordered by how deterministic they are. A lower layer fails earlier, cannot be ignored, and costs less per check. Issues caught at compile time are far more often judged real problems than issues reported later on checked-in code (74% against 21% in one large-scale study), and checks only change behaviour when they block [[4]](#sources). Feedback inside the edit loop measurably improves agent results [[1]](#sources) [[2]](#sources), while prose instructions on their own do not [[8]](#sources) [[9]](#sources).

The rule that follows: solve a problem at the lowest layer that can express it. Move up only when the layer below cannot.

### 1. Architecture

**The practice.** Make the wrong change impossible, or make it obviously wrong. Give each kind of module one home, enforce the direction of imports, and offer one supported way to do each task. Published guidance for agent-driven codebases puts architecture first for exactly this reason: an agent that sees only the files it opened takes the shortest path that compiles, so the shortest path has to be the right one [[14]](#sources) [[16]](#sources).

**Why it matters.** Architecture erosion is the gap between intended and actual structure. It builds up through many small, locally reasonable changes, and is mostly noticed through symptoms because few tools detect it [[7]](#sources). Agents speed it up by copying the nearest example [[10]](#sources). The established remedy is a set of fitness functions: structural tests and import rules that fail the build when a boundary is crossed [[12]](#sources) [[10]](#sources). The framework does not provide this. Next.js leaves organisation to each project and asks only for consistency [[19]](#sources).

**How we achieve it.**

```
src/
  app/                 Routes only: page, layout, and Next's special files
    <route>/_parts/    Modules used by that one route and nowhere else
  tokens/              Design values: colours, type, space, motion
  ui/                  Design system: generic controls, no app knowledge
  diagrams/            Diagram kit
  components/          Page parts shared by two or more routes
    shell/             TopBar, Brand, Footer, Sidebar parts, PageShell, PageIntro, PageRail
    lesson/            LessonLayout, LessonHeader, LessonEnd, Pager, Prose, Callout, CodeBlock, Term, Table, ResourceList
    catalog/           LessonCard, Thumbnail, SectionHead, DiagramCard, DiagramIndex, DiagramSketch
  content/             Data and the functions that query it
    lessons/<slug>/    One lesson: its MDX and its diagrams
  hooks/               Hooks used in two or more places, one per file
  lib/                 Pure functions: no React, no domain knowledge
rfc/                   Decisions
scripts/               Repository scripts: screenshots, generators
lint/                  Local lint rules
```

- A module used by one route lives in that route's `_parts/` folder, which Next.js excludes from routing. When a second route imports it, it moves to `components/<area>` in the same change.
- A hook used by one component stays in that component's file. Animation hooks live in `src/diagrams`. Shared hooks go in `src/hooks` as `useThing.ts`.
- `PascalCase.tsx` exports one component named after the file. `camelCase.ts` is a module. No `index.ts` barrels, and no files named `utils`, `helpers`, `common`, `misc`, or `shared`, since generic names attract unrelated code.
- One supported way per task. Links go through `src/ui/Link` or `ButtonLink`. Base UI is imported only in `src/ui`. Icons render through `<Icon>`. Persistent browser state (`localStorage`) is read and written only in `src/hooks`, so each stored value has one writer.
- New work adds files instead of editing shared ones. A lesson is a folder, and whether it is written is derived from its MDX file existing, not from a flag kept in sync by hand.
- Generators (`new:primitive`, `new:lesson`, `new:diagram`) create new modules in the right place with the right shape, so the conventional path is also the fastest one [[16]](#sources).

Import direction is enforced by `no-restricted-imports` in a `files` block per folder:

| Folder          | May import                                          |
| --------------- | --------------------------------------------------- |
| `tokens`, `lib` | nothing in `src`                                    |
| `content`       | `lib`                                               |
| `hooks`         | `content`, `lib`                                    |
| `ui`            | `tokens`, `lib`, Base UI, Lucide                    |
| `diagrams`      | `tokens`, `ui`, `lib`, `hooks`                      |
| `components`    | everything above                                    |
| `app`           | everything; a route's `_parts` only from that route |

### 2. Types

**The practice.** Encode invariants in the type system so the compiler rejects invalid states, and close every way of telling the compiler to stop checking.

**Why it matters.** The compiler is the earliest and most trusted check in the toolchain [[4]](#sources). Its value disappears if it can be switched off locally. Type assertions are erased at compile time and perform no runtime check [[22]](#sources), so `value as User` silences the checker without proving anything. `@ts-ignore` and its relatives do the same with less pretence. An agent under pressure to pass a build will use whichever escape is available.

**How we achieve it.**

- `strict` stays on, and `noUncheckedIndexedAccess` is added, so indexed reads are typed as possibly undefined.
- `@ts-ignore`, `@ts-nocheck` and `@ts-expect-error` are banned. Type assertions are banned except `as const`.
- `types.ts` files export only types. `type` over `interface`, unions over `enum`, modules over `namespace`.
- Design scales are typed exports, for example a `weight` scale in `typography.ts` used as `fontWeight: weight.medium`, so a value outside the scale does not type-check against the token.

### 3. Lint rules

**The practice.** Turn every convention the type system cannot express into a lint rule that fails the build, with an error message that states the fix. Land each rule together with the cleanup of every existing violation.

**Why it matters.** Linting in the edit loop raised an agent's benchmark resolution from 15.0% to 18.0% when it rejected invalid edits [[1]](#sources). Feeding static analysis back to a model over ten iterations cut security issues from over 40% of samples to 13%, and readability violations from over 80% to 11% [[2]](#sources). For agents, the error message is the instruction, so it should carry the remediation [[10]](#sources) [[12]](#sources). Warnings do not change behaviour, which is why mature static analysis programs either break the build or show nothing, and fix existing instances before turning a check into an error [[4]](#sources).

The rules target four practices that cause harm in an agent-driven codebase:

- **Code comments.** Comments are not checked against the code they describe, so they drift. Across 1,500 projects, only 13% to 20% of code changes came with a change to the related comments [[5]](#sources), and changes that leave code and comment inconsistent are about 1.5 times more likely to introduce a bug [[6]](#sources). For an agent, a stale comment is a stale instruction in its context, and comments are a common place to justify a workaround instead of fixing its cause [[13]](#sources). Rule: no comments in `src`. Intent is carried by names, types, extracted functions, and checks.
- **Hand-written design values.** A design token is a named design decision stored once and referenced everywhere, and the W3C community format for tokens reached its first stable version in 2025 [[18]](#sources). A literal such as `fontWeight: 500` is a copy of a decision. Copies drift independently, cannot follow a theme, and are copied again by the next agent. Rule: colours and typography only from `src/tokens`. Meaning colours (signal, fault, sound) only in diagrams, with UI-named aliases such as `accent`, `danger` and `success` for page parts, and `focus` kept for focus rings. Raw spacing values get a ratchet that fails only when a change adds one, until spacing tokens exist.
- **Effects and timers used as patches.** Effects are an escape hatch for synchronising with external systems, and many common uses are unnecessary and cause extra renders and bugs [[17]](#sources). Timers are a common way to hide an ordering bug instead of fixing it [[13]](#sources). Both are legitimate for animation. Rule: `useEffect`, `setTimeout` and `requestAnimationFrame` only in the diagram kit's animation hooks and a short named list, settled when the diagram kit is built.
- **Inline escape hatches.** A rule that can be disabled at the call site is optional. Rule: disable directives are rejected (mechanism in [RFC 0002](0002-oxlint.md)), every rule is an error, and every exception is a named override in the lint config.

The linter and its base rule set are decided in [RFC 0002](0002-oxlint.md). The repository's own convention rules are designed one at a time. Rules that no existing rule or selector can express live as local rules.

### 4. Tests

**The practice.** Test behaviour, not implementation, and use tests for invariants that types and lint cannot see, such as data integrity and file structure.

**Why it matters.** Test feedback combined with static analysis let models repair 62% of incorrect programs and 89% of reported vulnerabilities [[3]](#sources). A test that would still pass if every function it calls returned nothing proves nothing, and should be fixed or deleted [[14]](#sources).

**How we achieve it.** Deferred. The intended shape is Vitest with tests beside their files and no module mocking, catalog and content integrity, `RuleTester` cases for local lint rules, a structure test that fails any file outside the allowed paths, and checks on `AGENTS.md` size and paths. `test` joins `verify` once the test runner exists.

### 5. Runtime verification

**The practice.** Prove that the rendered product works by driving it the way a user would and keeping evidence.

**Why it matters.** Static checks cannot show that a page renders or that an interaction works. Agents have been observed marking features complete after unit tests and `curl` checks without noticing the feature fails end to end, and adding browser automation substantially improved results [[11]](#sources). Teams running agents at scale give each one a running app instance and access to the DOM and screenshots [[10]](#sources). Interactive diagrams are exactly the output that static checks cannot judge.

**How we achieve it.** `shots` takes Playwright screenshots of key pages in light and dark at 390px and 1280px. It then grows into a verification script with five steps: launch the dev server, check it is healthy, drive a page by playing, stepping and resetting a diagram, save evidence of each state, and stop only the processes it started [[15]](#sources). A feature map lists each page and diagram from a reader's point of view. It is built alongside the diagram kit.

### 6. Prose

**The practice.** Use context files only for instructions a tool cannot check, keep them short, and place them next to the code they govern.

**Why it matters.** Agents follow instructions in context files, such as which command to run, but repository overviews do not improve results, and LLM-generated files perform worse than developer-written ones [[8]](#sources). A second study of 288 runs found no measurable change in correctness from context strategy [[9]](#sources). A single large instruction file has been reported to go stale quickly, and a file of about 100 lines that points to deeper material works better [[10]](#sources). Nested files are a supported convention, with the nearest file taking precedence [[21]](#sources). Nothing fails when an agent skips a prose rule, so prose is the last resort [[14]](#sources).

**How we achieve it.**

- Root `AGENTS.md`, under about 80 lines: commands, the definition of done, the placement table, the rule table pairing each rule with its enforcement, and the changes that need maintainer approval.
- Local `AGENTS.md` files only where judgment rules exist, under about 30 lines each: `src/ui` (wrapping Base UI, foundations coverage), `src/diagrams` (reduced motion, keyboard access, meaning colours), `src/content` (adding a lesson, writing voice), and `rfc`.
- `AGENTS.md` only, no `CLAUDE.md` files.
- Never in context files: descriptions of what files contain, folder trees, or anything a check already enforces.

## When each layer runs

The layers above define what is checked. Delivery defines when, and earlier is better [[4]](#sources). Hooks should stay silent on success and be specific on failure [[12]](#sources).

| When                 | What runs                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------- |
| After each edit      | Agent hook: `lint --fix` and `prettier --write` on the edited file, then report what remains |
| End of an agent turn | Agent hook: `npm run verify`; if it fails, the agent continues instead of stopping           |
| Before a commit      | lint-staged: Prettier and the linter on staged files                                         |
| Every push           | CI: `npm ci` and `npm run verify:full`, with branch protection on `main`                     |

Scripts: `verify` runs `format:check`, `lint --max-warnings 0` and `typecheck`, and replaces `check`. `verify:full` adds `next build` for changes to routes, config, or MDX. `lint:fix` runs the linter's autofix then `prettier --write`.

## The correction loop

When the same correction is needed twice, it becomes a control at the lowest layer of the pyramid that can express it: module design, then types, then lint, then a test, and only then a line in an `AGENTS.md` [[14]](#sources) [[12]](#sources). The new control must fail on the real mistake that prompted it. The rule table in the root `AGENTS.md` gains a row in the same change. Over time, rules move down the pyramid and the prose layer shrinks.

## Research

### Sources

| #   | Source                                                                                                                                                   | Type                              | What it says                                                                                                                                                                                                            |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [Yang et al. 2024, SWE-agent](https://arxiv.org/abs/2405.15793)                                                                                          | Peer-reviewed (NeurIPS)           | A linter that rejects invalid edits raised SWE-bench Lite resolution from 15.0% to 18.0%. Feedback should be informative but concise; guardrails limit error propagation.                                               |
| 2   | [Blyth et al. 2025](https://arxiv.org/abs/2508.14419)                                                                                                    | Preprint                          | Iterative Bandit and Pylint feedback cut security issues from over 40% to 13% and readability issues from over 80% to 11%. About 5% of iterations introduced a new issue.                                               |
| 3   | [Dolcetti et al. 2024](https://arxiv.org/abs/2412.14841)                                                                                                 | Preprint                          | Test and static analysis feedback let models repair 62% of incorrect programs and 89% of reported vulnerabilities.                                                                                                      |
| 4   | [Sadowski et al. 2018](https://research.google/pubs/lessons-from-building-static-analysis-tools-at-google/)                                              | Peer-reviewed (CACM), industry    | Build-time checks need no effective false positives; review-time checks are disabled above 10%. Checks must be actionable. Warnings are ignored. 74% of compile-time issues judged real against 21% in checked-in code. |
| 5   | [Wen et al. 2019](https://www.inf.usi.ch/faculty/lanza/PUBS/P/Wen2019a.pdf)                                                                              | Peer-reviewed (ICPC)              | Only 13% to 20% of code changes come with comment changes, across 1,500 projects and 3.3 million commits.                                                                                                               |
| 6   | [Radmanesh et al. 2024](https://arxiv.org/abs/2409.10781)                                                                                                | Preprint                          | Code-comment inconsistency makes bug-introducing commits about 1.5 times more likely.                                                                                                                                   |
| 7   | [Li et al. 2021](https://arxiv.org/abs/2103.11392)                                                                                                       | Preprint, practitioner study      | Architecture erosion is mostly detected through symptoms, with few dedicated tools.                                                                                                                                     |
| 8   | [Gloaguen et al. 2026](https://arxiv.org/abs/2602.11988)                                                                                                 | Peer-reviewed (ICLR)              | Context files did not generally raise success and added over 20% cost. Instructions were followed; overviews did not help.                                                                                              |
| 9   | [Khatri 2026](https://arxiv.org/html/2607.27250v1)                                                                                                       | Preprint, small sample            | No measurable change in correctness across context strategies over 288 runs.                                                                                                                                            |
| 10  | [Lopopolo 2026, Harness engineering (OpenAI)](https://openai.com/index/harness-engineering/)                                                             | Industry report, self-reported    | Layered architecture enforced by custom linters and structural tests; lint errors carry remediation; an `AGENTS.md` of about 100 lines; agents replicate existing patterns.                                             |
| 11  | [Young 2025, Effective harnesses for long-running agents (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Industry report                   | Agents marked features done without end-to-end testing; browser automation fixed it.                                                                                                                                    |
| 12  | [Böckeler 2026, Harness engineering](https://martinfowler.com/articles/harness-engineering.html)                                                         | Practitioner article              | Guides and sensors; structural tests and linters with messages written for LLMs; improve controls when an issue repeats.                                                                                                |
| 13  | [Tan 2026, All Code Is Slop (Except Mine)](https://ai.engineer/code/2026/talks/lauren-tan)                                                               | Industry talk, machine transcript | Deterministic checks first, runtime verification second, prose last; comments and timers used to justify workarounds; folder boundaries enforced by lint.                                                               |
| 14  | [pstack `/correct` skill](https://raw.githubusercontent.com/cursor/plugins/main/pstack/skills/correct/SKILL.md)                                          | Published agent workflow          | Fix repeated mistakes at the highest-leverage layer: architecture, types and lint, tests, docs last. New checks must fail on a real past mistake.                                                                       |
| 15  | [pstack `create-verification-skill`](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)                       | Published agent workflow          | Launch, health check, drive, evidence, cleanup, and a feature map.                                                                                                                                                      |
| 16  | [Dune method write-up](https://github.com/Dahhrk/dark-factory/blob/main/docs/dune-method.md)                                                             | Secondary write-up                | The conventional path should need fewer decisions than a shortcut; generators; one writer for durable state.                                                                                                            |
| 17  | [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)                                                              | Official docs                     | Effects are an escape hatch; many common uses are unnecessary.                                                                                                                                                          |
| 18  | [Design Tokens Format Module 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)                                      | Specification                     | First stable format for design tokens.                                                                                                                                                                                  |
| 19  | [Next.js project structure](https://nextjs.org/docs/app/getting-started/project-structure)                                                               | Official docs                     | Private `_folders` opt out of routing; organisation is left to the project.                                                                                                                                             |
| 20  | [Claude Code memory](https://code.claude.com/docs/en/memory)                                                                                             | Official docs                     | Context files are not enforced; keep each under 200 lines.                                                                                                                                                              |
| 21  | [agents.md](https://agents.md/)                                                                                                                          | Convention                        | Nested `AGENTS.md` files; the nearest takes precedence.                                                                                                                                                                 |
| 22  | [TypeScript handbook: type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)                               | Official docs                     | Assertions are removed at compile time; there is no runtime check.                                                                                                                                                      |

Not available: the full text of de Silva and Balasubramaniam's 2012 survey on architecture erosion. Industry throughput figures (pull request counts, lines of code) are self-reported and are not used as evidence.

### What we learned

1. Feedback in the edit loop improves agent output; instructions alone do not measurably help [1] [2] [3] [8] [9].
2. A check only works if it is actionable, early, and blocking, with near-zero false positives [4].
3. Existing code is part of the prompt, so a rule lands together with the cleanup of every violation [4] [10].
4. Architecture has to be checked mechanically to survive [7] [10] [12].
5. Static checks are not verification of rendered behaviour [11] [15].
6. Context files should be short and instruct rather than describe [8] [10] [20].
7. Repeated failures should improve the controls, at the most deterministic layer available [12] [14].

Where this RFC goes further than its sources: some published practice keeps a small set of comments that record external constraints, allows inline lint exceptions with a reason and an expiry date, or requires a justification comment before a type assertion. This RFC removes all three. In a single-maintainer repository, a named override in the lint config gives the same visibility with no unchecked text in the code.

## Alternatives considered

- **Prose-only conventions in a long `AGENTS.md`.** Cheapest to write and easy to read. Rejected because nothing fails when an agent ignores it, and controlled studies found no success gain at higher cost.
- **Adopting a published agent plugin or rule set.** Faster to start and maintained elsewhere. Rejected because the available kits target other editors or linters and bring rules for problems this codebase does not have.
- **Oxlint instead of ESLint.** Evaluated in [RFC 0002](0002-oxlint.md).
- **`components/<page>/` instead of `_parts/`.** Keeps every component in one tree. Rejected because route-only modules end up far from their route, and the folder name does not express who may import them.
- **A flat `components/` folder.** Fewer placement decisions. Rejected because it already holds 24 files and will roughly double.
- **`eslint-plugin-boundaries` or `dependency-cruiser`.** Purpose-built for layer rules. Deferred because `no-restricted-imports` covers seven folders without a new dependency.
- **One large root `AGENTS.md`.** One file to read. Rejected because large context files degrade adherence and local files load only near the work.

## Tradeoffs and risks

- **Strict rules add friction to small changes.** Mitigated by error messages that state the fix.
- **False positives erode trust in checks.** Mature programs disable checks above 10% effective false positives [4]. A rule that misfires gets a narrower selector or a named override in the same change.
- **Local rules are owned code.** Until testing lands, a broken rule can go unnoticed.
- **The end-of-turn hook adds latency.** If `verify` becomes slow, the hook runs lint and typecheck only.
- **Generators can encode outdated patterns.** A rule change updates its generator in the same change.
- **Claude Code reads `CLAUDE.md`, not `AGENTS.md`.** With `AGENTS.md` only, Claude Code will not load these files by itself; Cursor and Codex do. If this proves a problem, the smallest fix is a root `CLAUDE.md` symlinked to `AGENTS.md`.
- **Moving files churns history.** Moves wait until in-flight work lands.
