# RFC 0005: Tests

## Summary

A test runs code on a chosen input and compares the result with what it should be. Types prove that values are used consistently and lint proves that code follows rules, but neither can say whether a function returns the right answer, whether a set of data is consistent, or whether a check still catches anything. Tests are the earliest check that can. For agents they are also among the most useful feedback available: test failures let models repair most of the incorrect programs they write [[1]](#sources). That only holds while a failing test means broken code and a passing test means working code.

Test suites lose that property in the same few ways across codebases, and each has a known fix. Tests that check how code works instead of what it does break on every refactor and miss real bugs; testing through public APIs with real dependencies fixes that. Tests that pass without checking anything, through missing assertions, snapshots or coverage targets, give false confidence; lint rules and stated expected values fix that. Tests that depend on time, the network or each other fail at random until nobody trusts them; hermetic, deterministic tests fix that. And agents under pressure to pass will skip, weaken or rewrite tests [[3]](#sources); lint rules and a test-count ratchet make that impossible to do silently. This RFC sets up a runner, decides what is worth testing, and enforces each of these fixes so that agents write tests that professional reviewers would keep.

## Problem

A test is only as useful as the bug it can catch. That depends on three things: whether the test runs on every change, whether it checks the right result, and whether it fails for no other reason. Each common pitfall below breaks one of the three.

### What tests prove and what they do not

A test proves that the code gives the right result for the inputs the test chose. It says nothing about inputs it did not choose, and nothing about code it did not run. This has three consequences:

- **Tests complement types, not replace them.** Types cover every possible value of a variable but only check that it is used consistently. Tests check the actual result but only for a few values. A project needs both.
- **The choice of inputs is the test.** A test of `formatMinutes(30)` does not show what happens at 60. The boundaries, the empty case, the invalid case and the largest case are where bugs live.
- **A test is code, and can be wrong.** A test that asserts nothing, or asserts the wrong thing, passes. A test that is never seen to fail has not been shown to work.

### No runner, or a runner nobody runs

Without a test runner wired into the command that defines a finished change, tests are optional, and optional checks are skipped. Checks change behaviour only when they run early and block the change [[4]](#sources). A test suite that takes minutes is run less often, and a suite that runs only in continuous integration reports a mistake long after the agent that made it has moved on.

The runner also has to import the code as it is written. A runner that cannot resolve a project's path aliases or extensionless imports forces either a rewrite of the imports or a custom resolver to maintain.

### Tests coupled to implementation

A test that checks how a function works, such as which helpers it calls or what its internal state looks like, fails when the code is refactored even though its behaviour did not change. Large engineering organisations call these brittle tests and recommend testing through the public API and testing each behaviour rather than each method [[6]](#sources).

The main cause is mocking. A mock replaces a real dependency with a stand-in that returns what the test author expects. Developers report that mocks increase coupling between tests and production code and are hard to keep compatible with the code they replace [[15]](#sources), and engineering guidance prefers the real implementation whenever it is fast and deterministic [[7]](#sources). A mock also encodes the author's assumption about the dependency, so a test against a mock can pass while the real dependency behaves differently.

### Tests that pass without checking anything

- **No assertion.** A test that calls code and asserts nothing passes as long as nothing throws.
- **Snapshots.** A snapshot test stores the output of one run and fails when it changes. It states no expected value, and one flag regenerates it so it passes again.
- **Expected values computed by the code under test.** A test that builds its expected value with the same function it is testing can only agree with itself.
- **Coverage targets.** Coverage measures which lines ran, not whether their results were checked. Once suite size is controlled for, coverage has only a low to moderate correlation with a suite's ability to find faults [[8]](#sources). Google does not enforce a coverage threshold across its codebase [[9]](#sources). A target rewards tests that run lines without asserting on them.

### Flaky tests

A flaky test passes and fails on the same code. In a study of flaky tests in open-source projects, 45% were caused by waiting for asynchronous work with a fixed delay, 20% by concurrency and 12% by depending on the order tests ran in [[12]](#sources). At Google, about 16% of tests showed some flakiness, and about 84% of transitions from passing to failing in post-submit testing involved a flaky test [[13]](#sources). Flakiness rises sharply with test size: 0.5% of small tests against 14% of large ones [[14]](#sources).

Flaky tests destroy the signal tests exist to give. Once a failure might be noise, people and agents rerun instead of reading it, and real failures get rerun too. Automatic retries hide the problem rather than fix it [[5]](#sources).

### Checks that have never been shown to fail

A project's own checks, such as custom lint rules, structure checks and code generators, are code like any other, and a mistake in one usually makes it accept everything. A lint rule whose AST selector stops matching after a parser upgrade passes every file. Nothing turns red when that happens. Mutation testing, which deliberately introduces faults to see whether tests notice, is built on the same idea, and is run at scale on code review at Google [[10]](#sources) and used to steer generated tests at Meta [[11]](#sources).

### Agents weakening tests

When a test fails, the shortest path to a green run is often to change the test. In a benchmark built so that passing required cheating, agents modified the tests or special-cased the test inputs on up to 76% of tasks for one model, and some model families did it mostly by editing test files [[3]](#sources). An agent that can add `.skip`, delete a test, regenerate a snapshot or loosen an assertion will eventually do so.

## Goals

1. **One command runs every test.** The test suite is part of the command that defines a finished change and blocks it on failure. The whole suite runs in seconds, and the tests related to one edited file run in under two seconds.
2. **Every custom check is shown to fail.** Each custom lint rule, check script and generator has tests that include inputs it must reject.
3. **Invariants over data and configuration are tested.** Properties that hold across a whole data set, such as unique identifiers and valid references, fail the suite when broken, with a message naming the entry.
4. **Tests check behaviour through public interfaces.** No module mocks, no snapshots, no assertions on internal calls. Lint fails on each.
5. **Tests are deterministic.** No real network, clock or randomness in unit tests, tests run in random order, and failed tests are never retried automatically.
6. **Tests cannot be switched off or removed silently.** No `.only`, `.skip` or `.todo`, no conditional assertions, and the number of tests never drops below a recorded baseline without an edit to that baseline.

## Proposal

The proposal has six parts. Setting up the runner comes first, because nothing else runs without it. Choosing what to test comes second, because effort spent on low-value tests is effort not spent on high-value ones. The remaining parts set the standard every test is held to, from how it is written to how it is kept honest.

### 1. Set up the runner

#### Choosing a runner

The runner has to import the project's code exactly as it is written, run TypeScript without a separate build, and report concisely enough for an agent to act on.

- **Vitest** runs TypeScript directly and resolves imports with Vite, including extensionless imports and `tsconfig.json` path aliases when `resolve.tsconfigPaths` is on [[19]](#sources). `vitest related <files>` runs only the tests that import the given files [[17]](#sources). When it detects that it is running inside a coding agent, it switches to a minimal reporter that prints only failures [[17]](#sources), which matches the evidence that feedback for agents should be informative but concise [[2]](#sources). It is the default for projects whose code is resolved by a bundler, which includes Next.js, Vite and most front-end frameworks.
- **Node's built-in runner (`node:test`)** needs no dependency and runs TypeScript by stripping types. It requires a file extension in every import, ignores `tsconfig.json`, and fails on path aliases [[18]](#sources). It fits projects that already run directly on Node with explicit extensions, such as libraries and command-line tools.

Whichever runner is chosen, there is one. A second runner means a second set of conventions for agents to mix up, and a lint rule bans imports from the other.

#### Configuration

A single config file at the root. For a project with path aliases:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "lint/**/*.test.mts", "scripts/**/*.test.mts"],
    sequence: { shuffle: true },
    retry: 0,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
```

- `environment: "node"` runs tests without a simulated DOM. Component tests, where a project needs them, run in a real browser (part 5).
- `include` lists every folder that holds tests, so a test outside them is never silently skipped.
- `sequence.shuffle` runs tests in a random order, which exposes tests that depend on another test's leftovers [[17]](#sources). The seed is printed, so a failure can be replayed.
- `retry: 0` makes every failure count. A test that needs a retry to pass is flaky and is fixed, not rerun.
- `restoreMocks` and `unstubGlobals` undo spies and stubbed globals after each test, so no test leaks state into the next.

#### Placement and naming

A test sits next to the file it tests and shares its name: `src/lib/headingId.ts` and `src/lib/headingId.test.ts`. A reader or agent finds a module's tests without searching, and the test inherits the import rules of the folder it sits in. A structure check fails on a test file with no source file beside it, so tests cannot outlive the code they test.

#### Scripts

- `test` runs the whole suite once (`vitest run`). It is the last step of the command that defines a finished change, after formatting, lint and the type check, because those are faster and a test run on code that does not type-check produces noise.
- `test:related` runs the tests for the files an edit touched (`vitest related --run`). Agents run it after each edit.

### 2. Decide what to test

Tests cost time to write, run and maintain, so they go where a bug is both likely and expensive. In priority order:

#### Custom checks

Every custom lint rule, structure check, code generator and build script gets tests, first, because a check that fails open removes protection from every file it covers and nothing reports it. Each test suite includes:

- at least one input the check must accept and one it must reject, taken from real code in the project so the samples look like what the check will see;
- the exact error message for every rejected input, because the message is the instruction an agent acts on;
- one accepted input for each exemption the check makes, so an exemption cannot widen unnoticed.

Linters provide testers for this. Oxlint's `RuleTester`, imported from `oxlint/plugins-dev`, runs a rule over code samples and checks which are reported and with which message [[20]](#sources):

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

Scripts that read the file system and print in one step are split into a pure function that takes file paths and contents and returns problems, and a short entry that reads the disk and prints. Tests pass in-memory inputs, so no fixture folders are needed.

#### Invariants over data and configuration

An invariant is a property that must hold across a whole data set. Types can say that every item has an `id`; they cannot say that ids are unique, that a reference points at an item that exists, or that a list is in order. Content catalogs, route tables, feature flags, permission maps, translation files and seed data all carry invariants like these, and breaking one usually still builds. In a content site, for example: slugs are unique, lesson numbers run without gaps, every diagram's lesson exists, and every published lesson has a source file.

Invariant tests import the real data and check the property over all of it. They contain no copy of the data, so adding an entry needs no test change, and a failing invariant cannot be made to pass by editing a fixture. Each failure message names the entry and the fix, for example `lesson "dns" has number 12, expected 11: numbers run without gaps`.

#### Logic with branches and boundaries

Pure functions with conditions, loops, arithmetic, parsing or formatting are tested through their exported API. The inputs that matter are the boundaries: empty, one, many, the first and last element, zero and negative numbers, the value on each side of a threshold, malformed input, and the largest realistic input.

Parsers at the program's boundaries deserve the most attention, because every other part of the program trusts their output. Each parser is tested with valid input, each kind of invalid input, and, where one exists, a saved response from the real source.

#### Server code

A project with a server tests its entry points from the outside:

- **Route handlers and server functions** are called directly with a real `Request` or input object, and their `Response` or result is checked. No server process is needed, because these functions take and return standard web types.
- **Database code** runs against a real database of the same engine, started for the test run with a tool such as Testcontainers, which provides throwaway database instances in containers [[23]](#sources). Each test starts from a known state, usually a fresh schema or a transaction that is rolled back. Database clients and query builders are never mocked: a mocked query passes while the real query fails on a constraint, a type or a typo.
- **External services** are intercepted at the network level with a tool such as Mock Service Worker, which intercepts requests instead of patching `fetch` or the client module [[22]](#sources), and which Vitest recommends for network mocking [[17]](#sources). The real client code runs, including its parsing and error handling. Handlers return saved real responses and the failure cases: errors, timeouts and malformed bodies.
- **Contracts between services** owned by different teams are checked with consumer-driven contract tests such as Pact, where the consumer's tests produce the request and response pairs the provider must satisfy [[25]](#sources).

#### What is not tested here

- **What types and lint already guarantee.** A test that a field exists, or that a value has the right type, repeats a check that already runs.
- **Rendered pages and full user flows.** These are verified end to end in a real browser, where layout, styles and navigation are real. They are large tests, the most expensive and the most flaky [[14]](#sources), so they are kept few and run separately from this suite.
- **Third-party code.** A library is trusted to do what its documentation says. Tests cover how the project uses it.

### 3. Write tests that fail for the right reason

These rules are what separates a suite that catches bugs from one that only exists.

- **Test behaviour through the public API.** Call what other code calls and check what it returns or what visibly changes [[6]](#sources). Never assert on private functions, internal state, or which helper was called.
- **One behaviour per test, named as a sentence.** `returns undefined after the last lesson` tells the reader what broke without opening the file.
- **Arrange, act, assert.** Each test sets up its inputs, makes one call, and checks the result, in that order, with no logic between.
- **State expected values literally.** The expected value is written out, not computed. `expect(formatMinutes(61)).toBe("1h 01m")`, never an expected value built by the function under test or a copy of its logic.
- **Prefer real implementations.** In order of preference: the real implementation, a fake (a working, simplified version, such as an in-memory store), a stub that returns fixed values, and last, an interaction check. Use a test double only when the real thing is slow, non-deterministic or has side effects outside the process [[7]](#sources).
- **Design seams instead of mocking modules.** Code that depends on something hard to control in a test, such as time, randomness, storage or the network, takes it as a parameter or reads it through a small function the test can pass in. A storage hook that takes a parser function, for example, is tested by passing it inputs, with no mocking.
- **Use tables for many cases of one behaviour.** `it.each` runs the same assertion over a list of inputs and expected outputs, so adding a boundary case is one line.
- **Use property-based tests for parsers and invariants.** A property-based test states something that holds for all inputs, such as "parsing a formatted value returns the original", and a library such as fast-check generates many inputs and shrinks a failure to the smallest one that breaks it [[24]](#sources). It finds the inputs nobody thought to write.
- **Make failure messages actionable.** An assertion over a data set reports which entry failed and why, not `expected false to be true`.
- **Keep fixtures real and small.** Test data is copied from real data or real responses and trimmed to what the test needs. Invented data tests invented cases.

### 4. Make tests deterministic

A test gives the same result every time it runs on the same code, or it is fixed.

- **Unit tests are hermetic.** A hermetic test contains everything it needs to set up, run and tear down its environment [[5]](#sources). Small tests run in one process, with no sleeping, no I/O beyond reading the project's own files, and no blocking calls [[5]](#sources).
- **Time is controlled.** Tests that depend on the clock use fake timers, which replace `setTimeout`, `setInterval` and `Date`, and advance time explicitly. A fixed delay is never used to wait for asynchronous work, because that is the most common cause of flaky tests [[12]](#sources). Tests await the promise or condition itself.
- **Randomness is seeded.** Code that uses random values takes a source of randomness as a parameter, and tests pass a seeded one.
- **No real network.** Unit tests make no network requests. Integration tests intercept them (part 2).
- **No shared state between tests.** Each test creates what it needs. Random order (part 1) exposes any test that relies on another.
- **No retries.** A flaky test is fixed or deleted in the change that finds it. Large organisations that rerun flaky tests describe it as trading compute for engineering time, which delays the fix [[5]](#sources). Google reports a flaky rate of around 0.15% and notes that tests lose value as flakiness approaches 1% [[5]](#sources).

### 5. Test components in a real browser, through what users see

Many projects need tests for interactive components below the level of full user flows. Where they do:

- **Run them in a real browser.** Simulated DOMs such as jsdom only approximate a browser, which can produce false passes and false failures [[17]](#sources). They do not compute layout and do not apply compiled styles. Vitest's browser mode runs component tests in a real browser through Playwright [[17]](#sources).
- **Query and act the way a user does.** "The more your tests resemble the way your software is used, the more confidence they can give you" [[16]](#sources). Tests find elements by role, label and visible text, click and type through real events, and assert on what is on the screen. They never reach into component state, props or class names.
- **Test the component's behaviour, not its markup.** A test asserts that a dialog opens and traps focus, not that it renders a particular tree.

A project whose components are mostly styled primitives over a well-tested library, with little logic of their own, can skip component tests and rely on end-to-end checks of the pages that use them.

### 6. Keep tests honest

Every rule above can be broken in a single edit, so each one that a tool can check is enforced, and the rest are made visible.

#### Lint rules for test code

Test files follow the same lint rules as the code around them, plus rules for tests. Oxlint's native `vitest` plugin provides them [[21]](#sources):

- `vitest/no-focused-tests`: bans `.only`, which silently skips every other test.
- `vitest/no-disabled-tests` and `vitest/no-commented-out-tests`: ban `.skip`, `.todo` and commented-out tests, which turn a failing test into a passing run.
- `vitest/expect-expect`: a test must assert something.
- `vitest/no-conditional-expect`, `vitest/no-conditional-in-test` and `vitest/no-conditional-tests`: no assertions or tests behind a condition, which can be skipped without anyone noticing.
- `vitest/no-standalone-expect` and `vitest/valid-expect`: no assertions outside a test, and no assertions left incomplete.
- `vitest/no-identical-title` and `vitest/valid-title`: every test has a unique, non-empty name, so a failure can be found.
- `vitest/no-restricted-vi-methods` for `mock`, `doMock`, `unmock` and `hoisted`: no module mocking. Code that needs a seam takes its dependency as a parameter.
- `vitest/no-restricted-matchers` for `toMatchSnapshot`, `toMatchInlineSnapshot` and `toMatchFileSnapshot`: no snapshots. Every test states its expected value.
- `vitest/no-import-node-test`: one runner.
- `vitest/consistent-test-filename`: test files are named `*.test.ts`, so the runner and the structure check agree on what a test is.

#### A ratchet on the number of tests

A ratchet is a recorded number that a check allows to move in one direction only. A small script records the number of tests in a baseline file, fails when the count falls below it, and raises the baseline when the count grows. Deleting a test is still possible, but it requires an edit to the baseline file in the same change, which is visible in review. This addresses agents removing tests to reach a passing run [[3]](#sources) without blocking legitimate deletions.

#### No coverage threshold

Coverage reports are useful for finding code no test runs, and can be generated on demand. They do not gate a change, because coverage does not measure whether results are checked [[8]](#sources), and the largest published coverage programme leaves thresholds to individual teams [[9]](#sources).

#### Mutation testing for critical code

Mutation testing introduces small faults into the code, such as flipping a condition or changing a boundary, and reports any fault that no test catches. It is the direct measure of whether tests check results [[10]](#sources). It is slower than the suite itself, so it runs on demand or on changed files only, starting with the code where a missed bug is most expensive: parsers, permission checks and money. A surviving mutant becomes a new test.

#### The one rule that stays in prose

Whether a failing test or the code is wrong is a judgment call no tool can make. The rule is: when a test fails, fix the code. Change a test only when the intended behaviour changed, in the same change as the code, and say so in the change description.

## Research

### Sources

1. [Dolcetti et al. 2024](https://arxiv.org/abs/2412.14841). Preprint. Test and static analysis feedback let models repair 62% of incorrect programs.
2. [Yang et al. 2024, SWE-agent](https://arxiv.org/abs/2405.15793). Peer-reviewed (NeurIPS). Feedback in the agent loop raised resolution rates; feedback should be informative but concise.
3. [Zhong et al. 2025, ImpossibleBench](https://arxiv.org/abs/2510.20270). Peer-reviewed (ICLR 2026). When passing requires cheating, agents modify tests or special-case inputs, on up to 76% of tasks for one model; read-only test access prevents test edits.
4. [Sadowski et al. 2018, Lessons from building static analysis tools at Google](https://research.google/pubs/lessons-from-building-static-analysis-tools-at-google/). Peer-reviewed (CACM), industry. Checks must be early, actionable and blocking.
5. [Software Engineering at Google, ch. 11: Testing overview](https://abseil.io/resources/swe-book/html/ch11.html). Industry book. Test sizes (small runs in one process with no sleeping or I/O), hermetic tests, a mix of about 80% unit, 15% integration and 5% end-to-end; reruns trade compute for engineering time; tests lose value as flakiness nears 1%.
6. [Software Engineering at Google, ch. 12: Unit testing](https://abseil.io/resources/swe-book/html/ch12.html). Industry book. Test through the public API; write a test per behaviour; over-reliance on mocking frameworks makes tests brittle.
7. [Software Engineering at Google, ch. 13: Test doubles](https://abseil.io/resources/swe-book/html/ch13.html). Industry book. Prefer a real implementation if it is fast, deterministic and has simple dependencies; prefer fakes to mocks.
8. [Inozemtseva and Holmes 2014, Coverage is not strongly correlated with test suite effectiveness](https://cs.ubc.ca/~rtholmes/papers/icse_2014_inozemtseva.pdf). Peer-reviewed (ICSE). Five Java projects, 31,000 suites: low to moderate correlation between coverage and fault detection once size is controlled; coverage should not be a quality target.
9. [Ivanković et al. 2019, Code coverage at Google](https://homes.cs.washington.edu/~rjust/publ/google_coverage_fse_2019.pdf). Peer-reviewed (FSE), industry. No coverage threshold enforced across the codebase; teams opt into levels; coverage is used as one signal in review.
10. [Petrović and Ivanković 2018, State of mutation testing at Google](https://research.google/pubs/state-of-mutation-testing-at-google/). Peer-reviewed (ICSE SEIP), industry. Mutants surfaced in code review, used by about 6,000 engineers on about 30% of diffs with coverage data.
11. [Foster et al. 2025, Mutation-guided LLM-based test generation at Meta](https://arxiv.org/abs/2501.12862). Industry paper (FSE 2025). Generates faults for a specific concern, then tests that catch them; engineers accepted 73% of generated tests.
12. [Luo et al. 2014, An empirical analysis of flaky tests](https://huang.isis.vanderbilt.edu/cs8395/paper/flakytest.pdf). Peer-reviewed (FSE). Of 161 classified flaky test fixes, 45% asynchronous waits, 20% concurrency, 12% test order dependency; most were flaky when first written.
13. [Micco 2016, Flaky tests at Google and how we mitigate them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html). Engineering report. About 16% of tests show some flakiness; about 84% of pass-to-fail transitions involve a flaky test; reruns and quarantine.
14. [Listfield 2017, Where do our flaky tests come from?](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html). Engineering report. Flaky rate by size: 0.5% small, 1.6% medium, 14% large; size predicts flakiness better than tooling.
15. [Spadini et al. 2019, Mock objects for testing Java systems](https://link.springer.com/article/10.1007/s10664-018-9663-0). Peer-reviewed (EMSE). Mocking increases coupling between tests and production code; keeping mocks compatible is hard.
16. [Testing Library, Guiding principles](https://testing-library.com/docs/guiding-principles/). Official docs. Tests that resemble how software is used give more confidence; deal with DOM nodes, not component instances.
17. Vitest docs: [CLI](https://vitest.dev/guide/cli), [Reporters](https://vitest.dev/guide/reporters), [sequence](https://vitest.dev/config/sequence), [retry](https://vitest.dev/config/retry), [Mocking requests](https://vitest.dev/guide/mocking/requests), [Why browser mode](https://vitest.dev/guide/browser/why). Official docs. `vitest related`; minimal reporter inside coding agents; shuffled order to find dependent tests; retries off by default; Mock Service Worker recommended for network; simulated DOMs can give false positives and negatives.
18. [Node.js, Modules: TypeScript](https://nodejs.org/api/typescript.html). Official docs. Type stripping on by default; file extensions mandatory; `tsconfig.json` ignored; path aliases fail.
19. [Vite, Shared options: `resolve.tsconfigPaths`](https://vite.dev/config/shared-options). Official docs. Opt-in resolution of `tsconfig.json` paths.
20. [Oxc, Writing JS plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html). Official docs. `RuleTester` from `oxlint/plugins-dev`, based on ESLint's; the test framework supplies `describe` and `it`.
21. [Oxc, Oxlint rule reference](https://oxc.rs/docs/guide/usage/linter/rules/). Official docs. Native `vitest` plugin rules.
22. [Mock Service Worker](https://mswjs.io/docs/). Official docs. Intercepts requests at the network level in browsers and Node, instead of patching `fetch`.
23. [Testcontainers for Node.js](https://node.testcontainers.org/). Official docs. Throwaway instances of databases and other services in containers, for tests.
24. [fast-check, What is property-based testing](https://fast-check.dev/docs/introduction/what-is-property-based-testing/). Official docs. Properties checked over generated inputs; failures shrunk to a minimal counterexample; seeded runs.
25. [Pact](https://docs.pact.io/). Official docs. Consumer-driven contract tests: consumer tests produce request and response pairs the provider must satisfy.

Figures in sources 5, 9, 10, 11, 13 and 14 are reported by the organisations involved. Source 3's rates vary widely by model, benchmark variant and prompt; 76% is the highest for one model on one variant. Not read in full: the mutation testing paper behind source 10, and the parts of Vitest's docs on fake timers and dates.

### What we learned

1. Test feedback helps models fix their code when it is concise and blocking [1] [2] [4].
2. Large organisations converge on testing through public APIs, preferring real implementations and fakes to mocks, and keeping most tests small and hermetic [5] [6] [7]. Research on mocking supports the coupling concern [15].
3. Coverage is a weak measure of test quality, and the organisation with the largest published coverage programme does not enforce a threshold [8] [9]. Mutation testing measures what coverage does not, and is practical at scale when limited to changed code or specific concerns [10] [11].
4. Flakiness comes mostly from asynchronous waits, concurrency and order dependence, and grows with test size [12] [13] [14]. Reruns contain it but delay the fix [5].
5. Agents will weaken tests to pass [3]. The source's mitigation is restricting access to tests. This RFC uses lint rules and a ratchet instead, because tests live and change alongside the code they test.
6. Component tests are more trustworthy in a real browser and when written against what users see [16] [17].
7. The runner must resolve a project's imports as written; this rules out Node's built-in runner for code that uses path aliases or extensionless imports [18] [19].
8. No source studies snapshot tests in agent workflows. Banning them goes further than the sources, on the reasoning that a snapshot states no expected value and is regenerated by one flag.

## Alternatives considered

- **No unit tests; rely on types, lint and end-to-end checks.** Nothing new to maintain. Not chosen because custom checks would never be shown to fail, data invariants are invisible to types and lint, and end-to-end tests are the slowest and flakiest way to find a logic bug [14].
- **Node's built-in runner everywhere.** No dependency. Not chosen as the default because it cannot import code that uses path aliases or extensionless imports [18]. It remains the right choice for projects that run directly on Node.
- **Jest.** The most widely used runner, with the same `describe`, `it` and `expect` shape. Not chosen because it needs a separate TypeScript transform and extra configuration for ES modules, where Vitest needs neither.
- **Component tests in jsdom.** Fast and widely used. Not chosen because a simulated DOM can pass while the real page is broken [17]; where component tests are needed, browser mode runs the same tests in a real browser.
- **Snapshots for rendered output.** Cheap to write and good at noticing any change. Not chosen because they state no expected behaviour and are regenerated with one flag.
- **Mocking modules for isolation.** Fast tests with no setup. Not chosen because mocks couple tests to implementation and encode assumptions that can be wrong [7] [15]; seams and fakes give the same isolation with real behaviour.
- **A coverage threshold.** Easy to measure and common in CI. Not chosen because it does not measure whether results are checked [8].
- **Automatic retries.** Keep the build green while flaky tests are investigated. Not chosen for small tests, because they have no legitimate source of flakiness, and retries hide the real ones [5].

## Tradeoffs and risks

- **One more dependency.** The runner and its resolver are pinned to exact versions and upgraded deliberately.
- **Seams change code shape.** Passing time, randomness or a parser as a parameter adds an argument. The cost is small, and the same seams make the code easier to reuse.
- **Real databases and browsers slow integration tests.** They run separately from the small-test suite, so the per-edit loop stays fast.
- **The ratchet can be lowered on purpose.** An agent can still edit the baseline. The aim is that the edit is visible in review, not that it is impossible.
- **`vitest related` follows static imports only** [17]. Code loaded through dynamic imports, such as content files, does not select its tests. The full suite still runs them.
- **Some judgment remains.** Whether a failing test or the code is wrong cannot be checked by a tool. That one rule stays in prose.

Revisit if the suite outgrows its time budget, if Node's runner gains path alias support, if flaky tests appear in the small-test suite, or if a class of bug reaches users that only component tests would have caught.
