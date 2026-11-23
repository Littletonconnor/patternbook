# RFC 0005: Tests

## Summary

Types and lint rules check what code says. They cannot check what it does, whether the content it reads is consistent, or whether the other checks in `verify` still catch anything. RFC 0001 places tests above lint in its priority pyramid to cover that gap: behaviour, data integrity, and the correctness of the checks themselves. Test failures are among the most useful feedback a model can get, letting it repair most of the incorrect programs it writes [[1]](#sources). They only help if they fail on wrong behaviour and cannot be quietly weakened.

This RFC adds Vitest as the test runner and limits tests to three targets, in priority order: the local lint rules and check scripts, the content catalog's invariants, and pure logic. Rendering is left to runtime verification in a real browser. Snapshots, module mocks, coverage targets and switched-off tests are banned by lint, and the number of tests is tracked by a baseline, because each of those lets a test pass, or vanish, without showing that the code works [[5]](#sources) [[6]](#sources) [[7]](#sources). Vitest is chosen because it resolves this repository's imports as they are written, which Node's built-in runner cannot [[10]](#sources) [[11]](#sources).

## Problem

A test is a check that runs code on a known input and compares the result with what it should be. Its value comes from failing when the code is wrong. A test that would still pass if the code did nothing, or whose expected value is regenerated from the code's own output, proves nothing. The repository has no tests today, and the gaps below show where that matters.

### Checks that have never been shown to fail

A check fails open when a mistake in the check makes it accept everything, so it reports success while catching nothing. Nothing looks wrong when that happens: `verify` stays green.

The repository has nine local lint rules in `lint/rules/` and two check scripts, `scripts/checkStructure.mts` and `scripts/checkSpacing.mts`, and none of them has a test. A rule's AST selector can stop matching after a parser change, and Oxlint's JavaScript plugin support, which runs these rules, is alpha (RFC 0004). A rule that no longer matches passes every file in the repository. The only way to know a check works is to run it on an input it must reject and see it fail. Mutation testing, which deliberately breaks code to see whether tests notice, rests on the same idea and is used at scale to find tests that detect nothing [[4]](#sources).

**What changes:** every local rule and check script gets tests that include inputs it must reject.

### Data invariants that no check enforces

An invariant is a property that must hold across a whole set of data, such as every slug being unique. `src/content/catalog.ts` holds 17 topics and 87 lessons, `src/content/diagrams.ts` holds 9 diagrams that point to lessons by slug, and `src/content/lessons/registry.ts` maps slugs to MDX files. Pages look lessons up by slug and walk them in order for the previous and next links.

The type system can say that a lesson has a number and a slug. It cannot say that slugs are unique, that numbers run without gaps, that a diagram's lesson slug exists, or that a published lesson has an MDX file. When one of these breaks, the site still builds. The failure shows up as a wrong pager link, a diagram card pointing at a missing lesson, or a lesson page with no body. Lessons are added by agents through `npm run new:lesson`, so the catalog keeps growing through edits made without reading the whole file.

**What changes:** the catalog's cross-entry and cross-file rules become tests that read the real data.

### Logic that is only checked by looking at the page

Some modules hold logic with edge cases. `formatMinutes` switches format at 60 minutes. `neighbours` has to return nothing before the first lesson and after the last. `decodeStored` in `src/hooks/useLocalStorage.ts` has to fall back when stored JSON is malformed or fails its parser. `headingId` produces the anchors that both the lesson body and the "On this page" rail rely on. Today these are checked only by opening the site, which covers the common case and misses the boundaries.

**What changes:** pure functions get tests through their exported API, including their boundary inputs.

### Tests that pass without showing anything

Several common practices produce tests that pass without checking behaviour:

- **Coverage targets.** Coverage measures which lines a suite runs, not whether it checks their results. Across five large projects and 31,000 generated suites, coverage had only a low to moderate correlation with a suite's ability to detect faults once suite size was controlled for, and the authors conclude it should not be used as a quality target [[5]](#sources).
- **Module mocks.** A mock replaces a real module with a stand-in that returns what the test author expects. Developers report that mocking increases coupling between tests and production code, and that keeping mocks compatible with the class they replace is hard [[6]](#sources). Engineering guidance from large codebases says to prefer a real implementation whenever it is fast and deterministic, and to test results rather than which functions were called [[8]](#sources) [[9]](#sources).
- **Snapshots.** A snapshot test stores the output of one run and fails when it changes. It states no expected behaviour, and regenerating it with one flag makes it pass again.
- **Editing the test to pass.** When tests conflict with the task, coding agents often change the tests or special-case the test inputs instead of fixing the code. In a benchmark built to measure this, one frontier model did so on 76% of tasks in one variant, and some model families mostly did it by editing the test files [[7]](#sources).

**What changes:** lint bans the patterns that let a test pass without checking behaviour, and the suite's size is tracked so tests cannot disappear unnoticed.

## Goals

1. **Every check is shown to fail.** Each local lint rule and each check script has a test file with at least one input it must reject. The structure check fails when a rule in `lint/rules/` has no sibling test.
2. **Broken content fails the build.** A duplicate slug, a gap in lesson numbers, a diagram pointing at a missing lesson, or a published lesson without an MDX file makes `npm run test` fail with a message naming the entry.
3. **Tests are part of done.** `npm run verify` runs the whole suite. The suite finishes in under five seconds, and the tests related to one edited file in under two.
4. **Tests cannot be switched off or hollowed out from the code.** No `.only`, `.skip` or `.todo`, no module mocks, no snapshots, no assertion inside a condition. Lint fails on each.
5. **Tests do not disappear unnoticed.** The number of tests never falls below a recorded baseline. Lowering it means editing the baseline file in the same change.
6. **One dependency.** Vitest is the only new package, a dev dependency pinned to an exact version.

## Proposal

The proposal has six parts. The runner comes first because it decides what can be tested at all. The three targets follow in priority order, ranked by how much a silent failure costs: a broken check disables a whole layer of the pyramid for every file, broken content breaks pages, and broken logic breaks one feature. The rules that keep tests honest and the place of tests in `verify` come last, because they apply to all three.

### 1. Runner: Vitest

Vitest is a test runner built on Vite, a bundler and module resolver. It runs TypeScript directly, uses Vite's resolver for imports, and provides `describe`, `it` and `expect`.

**Why it is needed.** Code in `src` imports with the `@/` path alias from `tsconfig.json` and without file extensions (`from "./types"`), as the Next.js bundler expects. Node's built-in test runner, which runs TypeScript by stripping types, requires a file extension in every import, ignores `tsconfig.json`, and fails on `paths` aliases [[10]](#sources). Vite resolves `tsconfig.json` paths when `resolve.tsconfigPaths` is on, and resolves extensionless imports [[11]](#sources). Vitest can therefore import any module in `src` as it is written today.

**Feedback during edits.** `vitest related <files>` runs only the tests that import the given source files, which keeps feedback inside the edit loop [[12]](#sources). When Vitest detects that it is running inside a coding agent, it switches to a minimal reporter that prints only failures, in line with the evidence that feedback for agents should be informative but concise [[2]](#sources) [[12]](#sources).

**Configuration.** One `vitest.config.mts` at the root:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "lint/**/*.test.mts", "scripts/**/*.test.mts"],
  },
});
```

Tests run in Node, with no simulated DOM. Test files end in `.test.ts`, or `.test.mts` outside `src`, never `.test.tsx`, so no test renders a component. A `.test.tsx` file is not in `include` and is rejected by the structure check.

**Placement.** A test sits next to the file it tests and shares its name: `src/content/catalog.ts` and `src/content/catalog.test.ts`. A reader or agent finds a module's tests without searching, and the test inherits the import rules of the layer it sits in (RFC 0002). The structure check treats a test file as part of its sibling's layer, leaves it out of the "no route imports this module" check, and fails on a test file with no sibling source file.

### 2. Tests for the checks

These tests come first because a check that fails open removes protection from every file it was meant to cover, and nothing reports it.

**Local lint rules.** Oxlint provides a `RuleTester` for JavaScript plugin rules, imported from `oxlint/plugins-dev` and based on ESLint's tester. It runs a rule over code samples and checks which are reported and with what message [[13]](#sources). Each rule in `lint/rules/` gets a sibling `*.test.mts` with:

- at least one valid and one invalid case, each taken from real code in this repository, so the samples match what the rule will see;
- the exact message for every invalid case, because the message is the instruction an agent acts on (RFC 0004), so each rule exports its message;
- one valid case for each exemption the rule makes, such as `src/hooks` for `browser-apis-in-hooks`, so an exemption cannot widen unnoticed.

```ts
import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";

import { message, noEnum } from "./noEnum.mts";

RuleTester.describe = describe;
RuleTester.it = it;

new RuleTester().run("no-enum", noEnum, {
  valid: ['type Level = "foundations" | "core" | "advanced";'],
  invalid: [{ code: "enum Level { Core }", errors: [{ message }] }],
});
```

**Check scripts.** `checkStructure.mts` and `checkSpacing.mts` read the file system and print problems in one step, which makes them hard to test. Each is split into a pure function that takes a list of files and their contents and returns problems, and a short entry that reads the disk and prints. Tests pass in-memory file lists: one that must produce no problems, and one per rule that must produce exactly the expected message. No fixture folders are needed and nothing is mocked.

### 3. Content invariants

These tests import the real data from `src/content` and check properties that hold across entries or across files. They contain no copy of the data, so adding a lesson needs no test change, and a failing invariant cannot be made to pass by editing a fixture.

| Data            | Invariant                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Topics          | Slugs unique; every topic has at least one lesson.                                                                                                   |
| Lessons         | Slugs unique across all topics; numbers run from 1 to the lesson count in catalog order, with no gaps; minutes is a positive integer.                |
| Starter lessons | At least one exists.                                                                                                                                 |
| Diagrams        | Numbers unique; each diagram's lesson slug resolves; the diagram number starts with that lesson's number (`33.1` belongs to lesson 33).              |
| Lesson sources  | Every published lesson has a registry entry and `src/content/lessons/<slug>/index.mdx`; every registry entry and lesson folder has a catalog lesson. |
| Lesson headings | Within each MDX file, `##` headings produce unique anchor ids, so the rail never links two sections to one anchor.                                   |
| Glossary        | Terms unique.                                                                                                                                        |

Each failure message names the entry and the fix, for example `lesson "dns" has number 12, expected 11: numbers run without gaps in catalog order`.

### 4. Pure logic

Functions with branches or boundaries are tested through their exported API with real inputs: `neighbours` at the first and last lesson and for an unknown slug, `formatMinutes` at 59, 60 and 61 minutes, `totals` on an empty list, `headingId` on headings with code and punctuation, `decodeStored` with `null`, malformed JSON and a value its parser rejects, and `clampWidth` below, inside and above its range.

Tests check results, not calls. A test asserts what a function returns for an input, not which other functions it called, because tests of behaviour survive refactoring and tests of interactions break on it [[8]](#sources).

Hooks are not rendered. Where a hook holds logic worth testing, that logic is a plain exported function (`decodeStored`, `clampWidth`) and is tested as one. Code that touches the browser, such as `localStorage`, cookies and the clipboard, is checked in a real browser by runtime verification (RFC 0006).

Three things are deliberately not tested here. Anything the type system or lint already guarantees, such as a lesson having a `level` or a colour coming from tokens, would only repeat a check. React components and route files are not rendered in a simulated DOM, because a simulated DOM does not apply compiled StyleX styles or compute layout, so it can pass while the real page is broken; RFC 0006 checks rendered pages in a real browser. And there is no coverage threshold, because coverage does not measure whether results are checked [[5]](#sources), and a threshold rewards tests that run lines without asserting on them.

### 5. Rules for test code

Test files get the same lint rules as the code around them, plus rules from Oxlint's native `vitest` plugin [[14]](#sources). Each one closes a way for a test to pass without checking anything:

- `vitest/no-focused-tests`: `.only`, which silently skips every other test.
- `vitest/no-disabled-tests`, `vitest/no-commented-out-tests`: `.skip`, `.todo` and commented-out tests, which turn a failing test into a passing run.
- `vitest/expect-expect`: a test with no assertion, which passes as long as nothing throws.
- `vitest/no-conditional-expect`, `vitest/no-conditional-in-test`, `vitest/no-conditional-tests`: assertions or tests behind a condition, which can be skipped without anyone noticing.
- `vitest/no-standalone-expect`, `vitest/valid-expect`: assertions outside a test, or never completed, which check nothing.
- `vitest/no-identical-title`, `vitest/valid-title`: duplicate or empty titles, which make a failure hard to locate.
- `vitest/no-restricted-vi-methods` for `mock`, `doMock`, `unmock` and `hoisted`: module mocking. Tests use real modules, and code that needs a seam takes its dependency as a parameter, as `useLocalStorage` already takes its parser [[6]](#sources) [[9]](#sources).
- `vitest/no-restricted-matchers` for `toMatchSnapshot`, `toMatchInlineSnapshot` and `toMatchFileSnapshot`: snapshots. Every test states its expected value.
- `vitest/no-import-node-test`: imports from `node:test`, so there is one runner.

### 6. Tests in verify

Two scripts are added:

- `test`: `vitest run`, the whole suite.
- `test:related`: `vitest related --run`, for the files an edit touched.

`test` runs last in `verify`, after format, lint, typecheck, structure and spacing. Those steps are faster and catch most mistakes first, and tests run on code that does not type-check produce noise. A failing test blocks the change like any other check, because checks only change behaviour when they block [[3]](#sources).

The suite size is tracked the same way as the spacing ratchet (RFC 0004). `scripts/testBaseline.json` records the number of tests. `verify` fails if the count falls below it and raises the baseline automatically when the count grows. Deleting a test therefore requires an edit to the baseline in the same change. This answers the evidence that agents remove or rewrite tests to get a passing run [[7]](#sources): the change is still possible, but it is never silent.

## Research

### Sources

| #   | Source                                                                                                                                                             | Type                                | What it says                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [Dolcetti et al. 2024](https://arxiv.org/abs/2412.14841)                                                                                                           | Preprint                            | Test and static analysis feedback let models repair 62% of incorrect programs.                                                                                     |
| 2   | [Yang et al. 2024, SWE-agent](https://arxiv.org/abs/2405.15793)                                                                                                    | Peer-reviewed (NeurIPS)             | Feedback in the agent's loop raised resolution rates; feedback should be informative but concise.                                                                  |
| 3   | [Sadowski et al. 2018, Lessons from building static analysis tools at Google](https://research.google/pubs/lessons-from-building-static-analysis-tools-at-google/) | Peer-reviewed (CACM), industry      | Checks must be early, actionable and blocking; warnings are ignored.                                                                                               |
| 4   | [Petrović and Ivanković 2018, State of mutation testing at Google](https://research.google/pubs/state-of-mutation-testing-at-google/)                              | Peer-reviewed (ICSE SEIP), industry | Mutants surfaced in code review; used by about 6,000 engineers and run on about 30% of diffs that have coverage data.                                              |
| 5   | [Inozemtseva and Holmes 2014, Coverage is not strongly correlated with test suite effectiveness](https://cs.ubc.ca/~rtholmes/papers/icse_2014_inozemtseva.pdf)     | Peer-reviewed (ICSE)                | Five Java projects, 31,000 suites: low to moderate correlation between coverage and fault detection once size is controlled; coverage should not be a target.      |
| 6   | [Spadini et al. 2019, Mock objects for testing Java systems](https://link.springer.com/article/10.1007/s10664-018-9663-0)                                          | Peer-reviewed (EMSE)                | Four systems, developer interviews and a survey of 105 developers. Mocking increases coupling between tests and production code; keeping mocks compatible is hard. |
| 7   | [Zhong et al. 2025, ImpossibleBench](https://arxiv.org/abs/2510.20270)                                                                                             | Peer-reviewed (ICLR 2026)           | When tests conflict with the task, agents modify tests or special-case inputs, on up to 76% of tasks for one model. Read-only test access prevents test edits.     |
| 8   | [Software Engineering at Google, ch. 12: Unit testing](https://abseil.io/resources/swe-book/html/ch12.html)                                                        | Industry book                       | Test through the public API; write a test per behaviour; over-reliance on mocking frameworks makes interaction tests brittle.                                      |
| 9   | [Software Engineering at Google, ch. 13: Test doubles](https://abseil.io/resources/swe-book/html/ch13.html)                                                        | Industry book                       | A real implementation is preferred if it is fast, deterministic and has simple dependencies.                                                                       |
| 10  | [Node.js, Modules: TypeScript (v24)](https://nodejs.org/download/release/latest-v24.x/docs/api/typescript.html)                                                    | Official docs                       | Type stripping is on by default; file extensions are mandatory; `tsconfig.json` is ignored; `paths` aliases fail; `.tsx` is unsupported.                           |
| 11  | [Vite, Shared options: `resolve.tsconfigPaths`](https://vite.dev/config/shared-options)                                                                            | Official docs                       | Opt-in resolution of `tsconfig.json` `paths` for files the tsconfig includes.                                                                                      |
| 12  | [Vitest, CLI](https://vitest.dev/guide/cli) and [Reporters](https://vitest.dev/guide/reporters)                                                                    | Official docs                       | `vitest related` runs tests that import the given files (static imports only); a minimal reporter is used automatically inside coding agents.                      |
| 13  | [Oxc, Writing JS plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html)                                                                          | Official docs                       | `RuleTester` from `oxlint/plugins-dev`, based on ESLint's; `describe` and `it` are supplied by the test framework.                                                 |
| 14  | [Oxc, Oxlint rule reference](https://oxc.rs/docs/guide/usage/linter/rules/)                                                                                        | Official docs                       | Native `vitest` plugin rules, including focused, disabled, conditional and snapshot checks.                                                                        |
| 15  | [RFC 0001](0001-agent-first-repo.md), [RFC 0002](0002-architecture.md), [RFC 0004](0004-lint.md)                                                                   | This repository                     | The priority pyramid, layer and placement rules, local lint rules and the spacing ratchet.                                                                         |

Adoption figures in source 4 are reported by the system's authors. Source 7's rates vary widely by model, benchmark variant and prompt; 76% is the highest reported for one model on one variant. The full text of source 4, including how developers responded to surfaced mutants, was not read.

### What we learned

1. Test feedback helps models fix their code, as long as it is concise and blocking [1] [2] [3].
2. A check is trustworthy only once it has been seen to fail on bad input. Mutation testing applies that idea to whole suites [4]. This RFC applies it in a narrower, cheaper form: every check carries its own rejecting cases.
3. Coverage is a weak signal of test quality and a poor target [5].
4. Mocks couple tests to implementation, and large codebases prefer real implementations where they are fast and deterministic [6] [8] [9].
5. Agents weaken or rewrite tests to pass when they can [7]. The source's mitigation is restricting test access. This RFC makes removal visible through a baseline instead, because tests here live in the same tree as the code and are edited with it.
6. Node's built-in runner cannot import this repository's source as written [10], and Vite's resolver can [11]. That, not speed or features, decides the runner.
7. No source studies snapshot tests in agent workflows. Banning them goes further than the sources, on the reasoning that a snapshot states no expected value and is regenerated by one flag.

## Alternatives considered

- **No tests; rely on types, lint and runtime verification.** No new dependency and nothing to maintain. Not chosen because nothing would show that the local rules and check scripts still fail on bad input, and catalog invariants are invisible to types, lint and a browser alike until a reader hits a broken link.
- **Node's built-in test runner (`node:test`).** No dependency, ships with the Node version in `.nvmrc`, and the check scripts already run under Node's type stripping. Not chosen because it cannot import `src` modules: every extensionless import and every `@/` alias fails [10]. Making it work means rewriting every import in `src` with explicit extensions and no alias, or owning a custom module resolution hook.
- **Jest.** The most widely used runner, with the same `describe`, `it` and `expect` shape. Not chosen because it needs a separate TypeScript transform and extra configuration for ES modules, where Vitest needs neither.
- **Component tests in a simulated DOM (Testing Library with jsdom) or Vitest browser mode.** Would test interactive components directly. Not chosen because jsdom does not apply compiled StyleX styles or compute layout, so its passes are weak evidence, and a real browser is already the job of RFC 0006, which browser mode would duplicate.
- **Mutation testing (for example Stryker).** Measures directly whether tests catch changes to the code [4]. Not chosen yet because the suite will be small and mutation runs are slow; the rejecting cases in part 2 give the same assurance for the checks that matter most.
- **Coverage thresholds.** Easy to measure and common in CI. Not chosen because coverage does not measure whether results are checked and is a poor target [5].

## Tradeoffs and risks

- **One more dependency and toolchain.** Vitest brings Vite with it. Pinning the exact version contains upgrade churn, and the config is one file.
- **Tests make some changes slower.** Changing a lint rule's message means updating its test. That is intended: the message is the instruction, so changing it should be deliberate.
- **Check scripts must be restructured.** Splitting each script into a pure function and an entry is a one-time change to two files.
- **The baseline can be lowered on purpose.** An agent can still edit `testBaseline.json`. The aim is that the edit shows in review, not that it is impossible.
- **`vitest related` follows static imports only** [12]. The lesson registry uses dynamic imports, so editing an MDX file does not select the content tests. The full suite in `verify` still runs them.
- **Content tests read the file system.** The lesson-source invariants read `src/content/lessons/`, so they resolve paths from the repository root, as `lessonSource.ts` already does.

Revisit if the suite exceeds its time budget, if Node's runner gains `tsconfig.json` path support, if content moves out of TypeScript files, or if a class of bug appears that only component tests would have caught.
