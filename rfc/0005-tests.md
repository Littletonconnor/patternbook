# RFC 0005: Tests

## Summary

A test runs code on a chosen input and checks the result against what it should be. Types prove that values are used consistently, and lint proves that code follows the rules. Neither can say whether a function returns the right answer, whether two parts of a system work together, or whether a user can finish what they came to do. Tests are the checks that can answer those questions. For agents they are also some of the most useful feedback available: when models see test failures, they can repair most of the incorrect programs they write [[1]](#sources).

That only holds while a failing test means broken code and a passing test means working code. Test suites lose that property in the same few ways across codebases. Tests check how code works instead of what it does. Tests pass without checking anything. Tests fail at random. Agents under pressure skip, weaken or rewrite tests [[3]](#sources). This RFC sets out where to invest in tests, using the testing pyramid most engineering organisations follow. It then sets the practices that keep each kind of test honest, with worked examples, and the checks that enforce those practices so an agent cannot quietly break them.

## The testing pyramid

![Testing pyramid: static checks (types and lint) as the foundation, then unit tests (about 80% of tests, milliseconds, run after every edit), integration tests (about 15%, route handlers, a real database and API clients, seconds per test), and end-to-end tests at the top (about 5%, critical journeys in a real browser, minutes per run and the flakiest)](assets/0005-test-pyramid.svg)

Tests differ in how much of the system they run. A small test runs one function in one process. A large test starts the whole application and drives it like a user. Larger tests give more confidence that the product works, but they are slower, they fail at random more often, and when they fail they point at a whole flow rather than a line of code. Smaller tests are fast and precise but prove less on their own.

The pyramid is how large engineering organisations balance this. Google suggests a mix of about 80% unit tests, 15% integration tests and 5% end-to-end tests [[5]](#sources). The exact split matters less than the shape: many small tests at the bottom, fewer larger tests at each step up. Each layer covers what the layers below it cannot.

### Static checks: is the code well formed?

Types and lint sit under the pyramid because they cover every line on every edit without running anything. They are not tests, but they decide what tests need to do. A test that checks a value has the right type, or that a function was called with the right number of arguments, repeats a check that already runs and costs nothing. Tests start where static checks stop.

### Unit tests: is this logic right?

A unit test calls one function or module directly, in the same process, and checks what it returns. Unit tests have no network, no database and no real clock, so each one runs in milliseconds and gives the same result every time. When one fails, it names the function and the input that broke.

Unit tests are where most of the testing effort goes:

- **Logic with branches and boundaries**: formatting, calculations, sorting, state transitions.
- **Parsers** for data coming from outside the program, because everything else trusts their output.
- **Invariants over data**: properties that hold across a whole data set, such as unique identifiers and references that point at something that exists.
- **The project's own checks**: custom lint rules, structure checks and code generators.

Unit tests run after every edit.

### Integration tests: do the parts fit together?

An integration test runs several real parts together: a route handler with its validation and its database queries, or an API client with its parsing and error handling. Unit tests cannot catch a query that names a column that does not exist, or a client that cannot handle the error body a server actually sends. Integration tests can, because they use the real database engine and real responses.

Integration tests take seconds rather than milliseconds, because they start a database or intercept network traffic. A project has fewer of them than unit tests: one or two per route or external service, covering the success path and each kind of failure. They run before a change is merged.

### End-to-end tests: does the product work?

An end-to-end test starts the whole application and drives it in a real browser the way a user would: open a page, click, type, and check what appears. It is the only test that proves the layout, styles, routing, server and client all work together.

End-to-end tests are the slowest and the least stable. At Google, 14% of large tests showed flaky results in a week, compared with 0.5% of small tests [[14]](#sources). A failure says that a journey broke but not where. So end-to-end tests cover only the journeys that must never break, such as signing up, paying or reading a lesson, and everything they could check at a lower layer is checked there instead. A bug found by an end-to-end test is a sign that a unit or integration test is missing.

### Why this shape

The pyramid exists to give the fastest possible answer to "did I break something?" with the most precise pointer to what broke. A suite that is mostly end-to-end tests is sometimes called an ice-cream cone. It is slow enough that people stop running it, flaky enough that failures get rerun instead of read, and vague enough that each failure needs an investigation. A suite with no integration or end-to-end tests has the opposite problem: every function works alone, but nobody checked that they work together.

## Problem

A test is only as useful as the bug it can catch. That depends on three things: whether the test runs on every change, whether it checks the right result, and whether it fails for no other reason. Each common pitfall breaks one of the three.

### What tests prove and what they do not

A test proves that the code gives the right result for the inputs the test chose. It says nothing about inputs it did not choose, or about code it did not run.

- **The choice of inputs is the test.** A test of `formatMinutes(30)` does not show what happens at 60. Bugs live at the boundaries: empty, one, many, the first and last item, zero, negative numbers, either side of a threshold, malformed input.
- **A test is code, and can be wrong.** A test that asserts nothing, or asserts the wrong thing, passes. A test that has never been seen to fail has not been shown to work.

### Tests nobody runs

Checks change behaviour only when they run early and block the change [[4]](#sources). A suite that takes minutes is run less often. A suite that only runs in continuous integration reports a mistake long after the agent that made it has moved on. A runner that cannot import the project's code as written forces a rewrite of the imports, or a custom resolver to maintain.

### Tests coupled to implementation

A test that checks how a function works, such as which helpers it calls or what its internal state looks like, fails whenever the code is refactored, even when the behaviour is unchanged. And it can still pass when the behaviour is wrong. Large engineering organisations call these brittle tests. They recommend testing through the public API and writing one test per behaviour rather than one per method [[6]](#sources).

The main cause is mocking. A mock replaces a real dependency with a stand-in that returns whatever the test author told it to. Developers report that mocks couple tests to production code and are hard to keep in step with the code they replace [[15]](#sources). Engineering guidance prefers the real implementation whenever it is fast and deterministic [[7]](#sources). A mock also encodes its author's beliefs about the dependency, so a test against a mock can only confirm those beliefs. When the same agent writes the code, the mock and the test, nothing in the loop checks any of them against reality.

### Tests that pass without checking anything

- **No assertion.** A test that calls code and asserts nothing passes as long as nothing throws.
- **Snapshots.** A snapshot test stores the output of one run and fails when it changes. It states no expected value, and one flag regenerates it so it passes again.
- **Expected values computed by the code under test.** A test that builds its expected value with the same logic it is testing can only agree with itself.
- **Coverage targets.** Coverage measures which lines ran, not whether their results were checked. Once suite size is controlled for, coverage has only a low to moderate correlation with how many faults a suite finds [[8]](#sources). Google does not enforce a coverage threshold across its codebase [[9]](#sources).

### Flaky tests

A flaky test passes and fails on the same code. In a study of flaky tests in open-source projects, 45% were caused by waiting a fixed time for asynchronous work, 20% by concurrency, and 12% by depending on the order tests ran in [[12]](#sources). At Google, about 16% of tests showed some flakiness, and about 84% of changes from passing to failing in post-submit testing involved a flaky test [[13]](#sources).

Flaky tests destroy the signal tests exist to give. Once a failure might be noise, people and agents rerun instead of reading it, and real failures get rerun too. Automatic retries hide the problem rather than fix it [[5]](#sources).

### Checks that have never been shown to fail

A project's own checks are code like any other, and a mistake in one usually makes it accept everything. A custom lint rule whose pattern stops matching after a parser upgrade passes every file, and nothing turns red. Mutation testing, which deliberately introduces faults to see whether tests notice, is built on the same idea. It runs at scale in code review at Google [[10]](#sources) and is used to steer generated tests at Meta [[11]](#sources).

### Agents weakening tests

When a test fails, the shortest path to a green run is often to change the test. In a benchmark built so that passing required cheating, agents modified the tests or special-cased the test inputs on up to 76% of tasks for one model. Some model families did it mostly by editing the test files [[3]](#sources). An agent that can add `.skip`, delete a test, regenerate a snapshot or loosen an assertion will eventually do so.

## Goals

1. **The pyramid holds.** Most tests are unit tests, integration tests cover each route and external service, and end-to-end tests cover only critical journeys.
2. **One command runs the suite.** Unit and integration tests are part of the command that defines a finished change and block it on failure. Unit tests related to one edited file run in under two seconds.
3. **Every custom check is shown to fail.** Each custom lint rule, check script and generator has tests that include inputs it must reject.
4. **Tests check behaviour through public interfaces, against real dependencies.** No module mocks, no snapshots, no assertions on internal calls. Lint fails on each.
5. **Tests are deterministic.** Unit tests touch no real network, clock or randomness. Tests run in random order, and failed tests are never retried automatically.
6. **Tests cannot be switched off or removed silently.** No `.only`, `.skip` or `.todo`, and no conditional assertions. The number of tests never drops below a recorded baseline without an edit to that baseline.

## Proposal

The proposal has five parts. Setting up the runner comes first, because nothing runs without it. What to test at each layer comes second, because effort spent on low-value tests is effort not spent where bugs are. The last three parts set the standard every test is held to: how it is written, how it stays deterministic, and how it is kept honest.

### 1. Set up the runner

#### Choosing a runner

The runner has to import the project's code exactly as it is written, run TypeScript without a separate build, and report concisely enough for an agent to act on.

- **Vitest** runs TypeScript directly and resolves imports with Vite. That includes imports without file extensions and, when `resolve.tsconfigPaths` is on, `tsconfig.json` path aliases such as `@/` [[19]](#sources). `vitest related <files>` runs only the tests that import the given files. When Vitest detects that it is running inside a coding agent, it switches to a minimal reporter that prints only failures [[17]](#sources). It is the default for projects whose code a bundler resolves, which covers Next.js, Vite and most front-end frameworks.
- **Node's built-in runner (`node:test`)** needs no dependency and runs TypeScript by stripping the types. It requires a file extension on every import, ignores `tsconfig.json`, and fails on path aliases [[18]](#sources). It suits projects that already run directly on Node with explicit extensions, such as libraries and command-line tools.

A project uses one runner. A second runner means a second set of conventions for agents to mix up.

#### Configuration

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.mts"],
    sequence: { shuffle: true },
    retry: 0,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
```

- `environment: "node"` runs tests without a simulated browser. Component tests, where a project needs them, run in a real browser as a separate project (part 2).
- `include` lists every folder that holds tests, so a test outside them can never be skipped without anyone noticing.
- `sequence.shuffle` runs tests in a random order, which exposes tests that depend on what an earlier test left behind [[17]](#sources). The seed is printed, so a failure can be replayed.
- `retry: 0` makes every failure count. A test that needs a retry to pass is flaky, and it gets fixed, not rerun.
- `restoreMocks` and `unstubGlobals` undo spies and replaced globals after each test, so no test leaks state into the next.

#### Placement and scripts

A test sits next to the file it tests and shares its name: `src/lib/money.ts` and `src/lib/money.test.ts`. A reader or agent finds a module's tests without searching, and the test follows the same import rules as the folder it is in. A structure check fails on a test file with no source file beside it, so tests cannot outlive the code they test.

- `test` runs unit and integration tests once (`vitest run`). It is the last step of the command that defines a finished change, after formatting, lint and the type check. Those steps are faster, and running tests on code that does not type-check only produces noise.
- `test:related` runs the tests for the files an edit touched (`vitest related --run`). Agents run it after every edit.
- `test:e2e` runs end-to-end tests. It runs before merge, not after every edit.

### 2. What to test at each layer

#### Unit: the project's own checks

These come first, because a check that fails open removes protection from every file it covers, and nothing reports it. Every custom lint rule, structure check, code generator and build script gets tests with:

- at least one input it must accept and one it must reject, taken from real code so the samples look like what the check will see;
- the exact error message for every rejected input, because the message is the instruction an agent acts on;
- one accepted input for each exemption the check makes, so an exemption cannot quietly widen.

Linters provide a tester for this. Oxlint's `RuleTester` runs a rule over code samples and checks which ones are reported, and with which message [[20]](#sources):

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

A script that reads files and prints problems in one step is split in two: a pure function that takes file paths and contents and returns problems, and a short entry point that reads the disk and prints. Tests call the pure function with in-memory inputs, so they need no fixture folders.

#### Unit: invariants over data

Types can say that every item has an `id`. They cannot say that ids are unique, that a reference points at an item that exists, or that a list has no gaps. Content catalogs, route tables, feature flags, permission maps, translation files and seed data all carry rules like these, and breaking one usually still builds.

Invariant tests import the real data and check the rule over all of it:

```ts
import { lessons } from "./catalog";

test("lesson numbers run from 1 with no gaps", () => {
  lessons.forEach((lesson, index) => {
    expect(lesson.number, `lesson "${lesson.slug}"`).toBe(index + 1);
  });
});
```

The test holds no copy of the data, so adding an entry needs no test change, and a broken rule cannot be fixed by editing a fixture. The failure names the entry: `lesson "dns": expected 11, received 12`.

#### Unit: logic and parsers

Pure functions with conditions, loops, arithmetic, parsing or formatting are tested through their exported API, at their boundaries. When one behaviour has many cases, a table keeps each case to one line:

```ts
test.each([
  [0, "0 min"],
  [59, "59 min"],
  [60, "1h 00m"],
  [61, "1h 01m"],
])("formatMinutes(%i) is %s", (minutes, expected) => {
  expect(formatMinutes(minutes)).toBe(expected);
});
```

Parsers are tested with valid input, with each kind of invalid input, and with a saved response from the real source where one exists.

#### Integration: route handlers

Route handlers and server functions take standard web `Request` objects and return `Response` objects, so a test can call them directly without starting a server. It runs the real validation, the real business logic and the real database:

```ts
import { POST } from "./route";

test("rejects a sign-up without an email", async () => {
  const response = await POST(
    new Request("http://test/api/signup", { method: "POST", body: JSON.stringify({}) }),
  );

  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: "email is required" });
});
```

Each handler gets a test for the success path and one for each kind of rejection: invalid input, missing permission, a record that does not exist.

#### Integration: the database

Database code runs against a real database of the same engine. A tool such as Testcontainers starts a throwaway instance in a container for the test run [[23]](#sources). Each test starts from a known state, usually by resetting the tables or by running inside a transaction that is rolled back.

The tempting alternative is to mock the database client:

```ts
vi.mock("@/server/db", () => ({
  db: { user: { findUnique: vi.fn().mockResolvedValue({ id: "1", name: "Ada" }) } },
}));

test("returns the user", async () => {
  expect(await getUser("1")).toEqual({ id: "1", name: "Ada" });
});
```

This test passes if the query filters on the wrong column, if the column was renamed in a migration, or if `getUser` ignores its argument entirely. It checks that the mock returns what the mock was told to return. The same behaviour against a real database:

```ts
const db = await startTestDatabase();
beforeEach(() => db.reset());

test("returns the user with the given id", async () => {
  await db.insert(users).values([
    { id: "1", name: "Ada" },
    { id: "2", name: "Grace" },
  ]);

  expect(await getUser(db, "2")).toEqual({ id: "2", name: "Grace" });
});

test("returns undefined for an id that does not exist", async () => {
  expect(await getUser(db, "missing")).toBeUndefined();
});
```

This test fails on a wrong column, a broken migration or an ignored argument. Two rows instead of one make sure the function actually filters.

#### Integration: external APIs

A service the project does not run, such as a payment provider or a third-party API, cannot be started in a test. The answer is still not to mock the client module. Instead, the test intercepts requests at the network level with a tool such as Mock Service Worker. MSW sits under `fetch` rather than replacing it [[22]](#sources), and Vitest recommends it for network mocking [[17]](#sources). The project's real client code runs, including its request building, parsing and error handling. Only the far side of the network is replaced, using responses saved from the real API:

```ts
const server = setupServer(
  http.get("https://api.github.com/repos/:owner/:repo", () => HttpResponse.json(savedRepoResponse)),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("reads the star count from a real response", async () => {
  expect(await fetchRepo("vercel", "next.js")).toEqual({ ok: true, data: { stars: 131204 } });
});

test("reports the service as unavailable on a 503", async () => {
  server.use(
    http.get(
      "https://api.github.com/repos/:owner/:repo",
      () => new HttpResponse(null, { status: 503 }),
    ),
  );

  expect(await fetchRepo("vercel", "next.js")).toEqual({ ok: false, error: "unavailable" });
});
```

`onUnhandledRequest: "error"` fails any test that makes a request nobody planned for, so no test can reach the real network by accident. Each client gets tests for a real success response, each error status it handles, a timeout, and a body that does not match the schema.

When two services owned by different teams depend on each other, consumer-driven contract tests such as Pact check that saved responses stay true. The consumer's tests record the requests and responses they rely on, and the provider's build checks that it still produces them [[25]](#sources).

#### Components

Many projects need tests for interactive components that sit below full user journeys. Where they do:

- **Run them in a real browser.** Simulated browsers such as jsdom approximate the DOM, which can produce false passes and false failures [[17]](#sources). They do not compute layout or apply compiled styles. Vitest's browser mode runs component tests in a real browser through Playwright [[17]](#sources). These tests use `.test.tsx` and run as a separate Vitest project from the Node tests.
- **Find and act on elements the way a user does.** "The more your tests resemble the way your software is used, the more confidence they can give you" [[16]](#sources). Tests find elements by role, label and visible text, click and type through real events, and check what is on the screen:

```tsx
test("marks a lesson as read", async () => {
  render(<MarkAsRead slug="dns" />);

  await page.getByRole("button", { name: "Mark as read" }).click();

  await expect.element(page.getByRole("button", { name: "Read" })).toBeVisible();
});
```

The test never reads component state, props or class names, so a refactor that keeps the behaviour keeps the test green. A project whose components are mostly styled primitives over a well-tested library, with little logic of their own, can skip component tests and rely on end-to-end tests of the pages that use them.

#### End-to-end

End-to-end tests drive the built application in a real browser with a tool such as Playwright. They cover a short list of journeys that must never break, chosen deliberately, and run before merge.

#### What is not tested

- **What static checks already guarantee.** A test that a field exists or a value has the right type repeats a check that already runs.
- **Third-party code.** A library is trusted to do what its documentation says. Tests cover how the project uses it.
- **Trivial code.** A function that only passes its arguments to another function needs no test of its own. It is covered by the tests of whatever calls it.

### 3. Write tests that fail for the right reason

These practices separate a suite that catches bugs from one that only exists.

#### Test what the code does, not how it does it

A test calls what other code calls, and checks what it returns or what visibly changes [[6]](#sources).

```ts
test("recalculates the total when an item is added", () => {
  const spy = vi.spyOn(cart, "recalculate");
  cart.add({ sku: "book", price: 1200 });
  expect(spy).toHaveBeenCalled();
});
```

This test breaks if `recalculate` is renamed or inlined, and passes if `recalculate` computes the wrong number. Checking the result instead:

```ts
test("adds the item's price to the total", () => {
  const cart = createCart();
  cart.add({ sku: "book", price: 1200 });
  expect(cart.total).toBe(1200);
});
```

#### Prefer the real thing, then a fake, and avoid mocks

A test double is anything that stands in for a real dependency. In order of preference [[7]](#sources):

1. **The real implementation**, whenever it is fast and deterministic: real parsers, real formatting, real in-process modules, and a real database in integration tests.
2. **A fake**: a small working version of a dependency that cannot run in a test, such as an in-memory store in place of a cloud storage service. A fake behaves like the real thing, so tests against it check behaviour. Where possible, the fake comes from the service's maintainers or is checked against the real service by a contract test, so it cannot drift.
3. **A stub**: a function that returns a fixed value, used for a dependency that only provides data.
4. **A mock that checks calls**, only when the call itself is the behaviour, such as checking that an email was sent, and only at the edge of the system.

Hand-written fakes for things that can run for real are avoided too. An in-memory imitation of a database does not enforce constraints, transactions or the query language, so tests pass against the fake and fail in production. If the real thing can run in a container, the test uses it.

#### Design seams instead of mocking modules

A seam is a place where a test can supply a dependency without replacing a module. Code that depends on something hard to control, such as the clock, randomness, storage or the network, takes it as a parameter:

```ts
export function isExpired(session: Session, now: Date) {
  return session.expiresAt.getTime() <= now.getTime();
}

test("treats a session as expired at the exact expiry time", () => {
  const session = { expiresAt: new Date("2026-01-01T00:00:00Z") };
  expect(isExpired(session, new Date("2026-01-01T00:00:00Z"))).toBe(true);
});
```

The function reads no global clock, so the test needs no fake timers, no mocked `Date` and no waiting. The same applies to a hook that reads storage: when it takes its parser as an argument, a test passes in inputs directly.

#### Write expected values out

```ts
expect(formatPrice(1999)).toBe(`$${(1999 / 100).toFixed(2)}`);
```

This expected value repeats the implementation's logic, so a bug in that logic appears on both sides and the test passes. The expected value is written literally instead:

```ts
expect(formatPrice(1999)).toBe("$19.99");
```

#### Keep each test small and readable

- **One behaviour per test, named as a sentence.** `returns undefined after the last lesson` tells the reader what broke without opening the file.
- **Arrange, act, assert.** Each test sets up its inputs, makes one call, and checks the result, in that order, with no loops or conditions in between.
- **Failure messages name the problem.** An assertion over a data set reports which entry failed, not `expected false to be true`.
- **Fixtures are real and small.** Test data is copied from real data or real responses and trimmed to what the test needs.

#### Use property-based tests for parsers and round trips

A property-based test states something that should hold for every input, such as "parsing a formatted value returns the original value". A library such as fast-check then generates hundreds of inputs and, when one fails, shrinks it to the smallest input that still fails [[24]](#sources). It finds the inputs nobody thought to write down.

### 4. Make tests deterministic

A test gives the same result every time it runs on the same code. If it does not, it gets fixed.

- **Unit tests are hermetic.** A hermetic test contains everything it needs to set up, run and tear down its environment [[5]](#sources). It runs in one process, with no sleeping, no I/O beyond reading the project's own files, and no network.
- **Time is controlled.** Code takes the current time as a parameter (part 3). Where that is not possible, tests use fake timers and advance time explicitly. A test never waits a fixed delay for asynchronous work, because that is the most common cause of flaky tests [[12]](#sources). It awaits the promise or the condition itself.
- **Randomness is seeded.** Code that uses random values takes a random source as a parameter, and tests pass a seeded one.
- **No shared state.** Each test creates what it needs. Random ordering (part 1) exposes any test that relies on another.
- **No retries.** A flaky test is fixed or deleted in the change that finds it. Rerunning flaky tests trades compute for engineering time and delays the fix [[5]](#sources).

### 5. Keep tests honest

Every practice above can be broken in a single edit. So each one a tool can check is enforced, and the rest are made visible.

#### Lint rules for test code

Test files follow the same lint rules as the code around them, plus rules for tests from Oxlint's native `vitest` plugin [[21]](#sources):

- `vitest/no-focused-tests`: no `.only`, which silently skips every other test.
- `vitest/no-disabled-tests` and `vitest/no-commented-out-tests`: no `.skip`, `.todo` or commented-out tests, which turn a failing test into a passing run.
- `vitest/expect-expect`: every test asserts something.
- `vitest/no-conditional-expect`, `vitest/no-conditional-in-test` and `vitest/no-conditional-tests`: no assertions or tests behind a condition, which can be skipped without anyone noticing.
- `vitest/no-standalone-expect` and `vitest/valid-expect`: no assertions outside a test, and none left incomplete.
- `vitest/no-identical-title` and `vitest/valid-title`: every test has a unique, readable name.
- `vitest/no-restricted-vi-methods` for `mock`, `doMock`, `unmock` and `hoisted`: no module mocking. Code that needs a seam takes its dependency as a parameter.
- `vitest/no-restricted-matchers` for `toMatchSnapshot`, `toMatchInlineSnapshot` and `toMatchFileSnapshot`: no snapshots. Every test states its expected value.
- `vitest/no-import-node-test`: one runner.
- `vitest/consistent-test-filename`: test files are named `*.test.ts` or `*.test.tsx`, so the runner and the structure check agree on what a test is.

#### A ratchet on the number of tests

A ratchet is a recorded number that a check only lets move in one direction. A small script records the number of tests in a baseline file. It fails when the count falls below the baseline and raises the baseline when the count grows. Deleting a test is still possible, but it requires an edit to the baseline file in the same change, where a reviewer will see it.

#### No coverage threshold

Coverage reports are useful for finding code no test runs, and can be generated on demand. They do not gate a change, because coverage does not measure whether results are checked [[8]](#sources). The largest published coverage programme leaves thresholds to individual teams [[9]](#sources).

#### Mutation testing for critical code

Mutation testing makes small changes to the code, such as flipping a condition or moving a boundary by one, and reports any change no test notices. It directly measures whether tests check results [[10]](#sources). It is slower than the suite, so it runs on demand or only on changed files, starting where a missed bug costs most: parsers, permission checks and money. Each surviving change becomes a new test.

#### The one rule that stays in prose

No tool can decide whether a failing test or the code is wrong. The rule is: when a test fails, fix the code. Change a test only when the intended behaviour changed, in the same change as the code, and say so in the change description.

## Why this works for agents

Every practice in this RFC is good engineering for people. Each one also closes a specific gap in how agents work.

- **Agents learn from the feedback in their loop, so the loop has to be fast and precise.** Feedback in the edit loop measurably improves agent results, and it works best when it is informative but concise [[1]](#sources) [[2]](#sources). A pyramid weighted toward unit tests, with `vitest related` after each edit and a reporter that prints only failures, gives the agent an answer in seconds that names the function and the input. An end-to-end failure after a ten-minute run would arrive too late and say too little.
- **Agents write the code and the test, so the test has to check against something the agent did not write.** When the same agent writes a function, a mock of its dependency and a test, all three share the same assumptions, and the test can only confirm them. A real database, a saved real API response, or a literal expected value is a fact from outside the agent's reasoning. A wrong assumption fails there.
- **Agents take the shortest path to green.** Given the chance, they skip tests, loosen assertions or edit tests to pass [[3]](#sources). Lint rules turn `.only`, `.skip`, snapshots, module mocks and conditional assertions into errors. The ratchet makes deleted tests visible. The remaining path to green is fixing the code.
- **Agents treat every failure as signal.** A flaky failure sends an agent off to fix code that is not broken, or teaches it that rerunning is the fix. Deterministic, hermetic tests with no retries mean a failure always means something.
- **Agents copy what they see.** Tests that sit next to their code, follow one shape (arrange, act, assert, one behaviour per test) and use real dependencies become the example the agent's next test imitates. A codebase full of mocks and snapshots teaches the opposite.
- **Agents change things they have not fully read.** An agent adding the eightieth entry to a catalog does not read the other seventy-nine. Invariant tests check the whole data set on every change, so a duplicate id or a broken reference fails with a message naming the entry.
- **Agents trust the project's checks.** If a custom lint rule silently stops matching, an agent will keep writing the pattern it was meant to block, and every check will say the code is fine. Tests for the checks themselves keep that trust deserved.

## Research

### Sources

1. [Dolcetti et al. 2024](https://arxiv.org/abs/2412.14841). Preprint. Test and static analysis feedback let models repair 62% of incorrect programs.
2. [Yang et al. 2024, SWE-agent](https://arxiv.org/abs/2405.15793). Peer-reviewed (NeurIPS). Feedback in the agent loop raised resolution rates; feedback should be informative but concise.
3. [Zhong et al. 2025, ImpossibleBench](https://arxiv.org/abs/2510.20270). Peer-reviewed (ICLR 2026). When passing requires cheating, agents modify tests or special-case inputs, on up to 76% of tasks for one model; read-only test access prevents test edits.
4. [Sadowski et al. 2018, Lessons from building static analysis tools at Google](https://research.google/pubs/lessons-from-building-static-analysis-tools-at-google/). Peer-reviewed (CACM), industry. Checks must be early, actionable and blocking.
5. [Software Engineering at Google, ch. 11: Testing overview](https://abseil.io/resources/swe-book/html/ch11.html). Industry book. Test sizes (a small test runs in one process with no sleeping or I/O); hermetic tests; a mix of about 80% unit, 15% integration and 5% end-to-end; reruns trade compute for engineering time.
6. [Software Engineering at Google, ch. 12: Unit testing](https://abseil.io/resources/swe-book/html/ch12.html). Industry book. Test through the public API; one test per behaviour; over-reliance on mocking frameworks makes tests brittle.
7. [Software Engineering at Google, ch. 13: Test doubles](https://abseil.io/resources/swe-book/html/ch13.html). Industry book. Prefer a real implementation if it is fast, deterministic and has simple dependencies; prefer fakes to mocks.
8. [Inozemtseva and Holmes 2014, Coverage is not strongly correlated with test suite effectiveness](https://cs.ubc.ca/~rtholmes/papers/icse_2014_inozemtseva.pdf). Peer-reviewed (ICSE). Five Java projects, 31,000 suites: low to moderate correlation between coverage and fault detection once size is controlled; coverage should not be a quality target.
9. [Ivanković et al. 2019, Code coverage at Google](https://homes.cs.washington.edu/~rjust/publ/google_coverage_fse_2019.pdf). Peer-reviewed (FSE), industry. No coverage threshold enforced across the codebase; teams opt into levels.
10. [Petrović and Ivanković 2018, State of mutation testing at Google](https://research.google/pubs/state-of-mutation-testing-at-google/). Peer-reviewed (ICSE SEIP), industry. Mutants surfaced in code review, used by about 6,000 engineers on about 30% of diffs with coverage data.
11. [Foster et al. 2025, Mutation-guided LLM-based test generation at Meta](https://arxiv.org/abs/2501.12862). Industry paper (FSE 2025). Generates faults for a specific concern, then tests that catch them; engineers accepted 73% of the generated tests.
12. [Luo et al. 2014, An empirical analysis of flaky tests](https://huang.isis.vanderbilt.edu/cs8395/paper/flakytest.pdf). Peer-reviewed (FSE). Of 161 classified flaky test fixes, 45% asynchronous waits, 20% concurrency, 12% test order dependency.
13. [Micco 2016, Flaky tests at Google and how we mitigate them](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html). Engineering report. About 16% of tests show some flakiness; about 84% of pass-to-fail transitions involve a flaky test.
14. [Listfield 2017, Where do our flaky tests come from?](https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html). Engineering report. Weekly flaky rate by size: 0.5% small, 1.6% medium, 14% large.
15. [Spadini et al. 2019, Mock objects for testing Java systems](https://link.springer.com/article/10.1007/s10664-018-9663-0). Peer-reviewed (EMSE). Mocking increases coupling between tests and production code; keeping mocks compatible is hard.
16. [Testing Library, Guiding principles](https://testing-library.com/docs/guiding-principles/). Official docs. Tests that resemble how software is used give more confidence.
17. Vitest docs: [CLI](https://vitest.dev/guide/cli), [Reporters](https://vitest.dev/guide/reporters), [sequence](https://vitest.dev/config/sequence), [retry](https://vitest.dev/config/retry), [Mocking requests](https://vitest.dev/guide/mocking/requests), [Why browser mode](https://vitest.dev/guide/browser/why). Official docs. `vitest related`; a minimal reporter inside coding agents; shuffled order to find dependent tests; retries off by default; Mock Service Worker recommended for network; simulated DOMs can give false positives and negatives.
18. [Node.js, Modules: TypeScript](https://nodejs.org/api/typescript.html). Official docs. Type stripping on by default; file extensions mandatory; `tsconfig.json` ignored; path aliases fail.
19. [Vite, Shared options: `resolve.tsconfigPaths`](https://vite.dev/config/shared-options). Official docs. Opt-in resolution of `tsconfig.json` paths.
20. [Oxc, Writing JS plugins](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html). Official docs. `RuleTester` from `oxlint/plugins-dev`, based on ESLint's.
21. [Oxc, Oxlint rule reference](https://oxc.rs/docs/guide/usage/linter/rules/). Official docs. Native `vitest` plugin rules.
22. [Mock Service Worker](https://mswjs.io/docs/). Official docs. Intercepts requests at the network level in browsers and Node, instead of patching `fetch`.
23. [Testcontainers for Node.js](https://node.testcontainers.org/). Official docs. Throwaway instances of databases and other services in containers.
24. [fast-check, What is property-based testing](https://fast-check.dev/docs/introduction/what-is-property-based-testing/). Official docs. Properties checked over generated inputs; failures shrunk to a minimal case; seeded runs.
25. [Pact](https://docs.pact.io/). Official docs. Consumer-driven contract tests: the consumer's tests produce request and response pairs the provider must satisfy.

Figures in sources 5, 9, 10, 11, 13 and 14 are reported by the organisations involved. Source 3's rates vary widely by model, benchmark variant and prompt; 76% is the highest for one model on one variant. Not read in full: the paper behind source 10, and the parts of Vitest's docs on fake timers and dates.

### What we learned

1. Large organisations converge on a pyramid: mostly small, hermetic tests, fewer integration tests, and few end-to-end tests, because larger tests are slower and much flakier [5] [14].
2. They also converge on testing through public APIs, with real implementations and fakes preferred to mocks [5] [6] [7]. Research on mocking supports the coupling concern [15].
3. Test feedback helps models fix their code when it is concise and blocking [1] [2] [4].
4. Coverage is a weak measure of test quality, and the organisation with the largest published coverage programme does not enforce a threshold [8] [9]. Mutation testing measures what coverage does not, and is practical when limited to changed code or specific concerns [10] [11].
5. Flakiness comes mostly from asynchronous waits, concurrency and order dependence [12] [13]. Reruns contain it but delay the fix [5].
6. Agents will weaken tests to pass [3]. The source's mitigation is to restrict access to tests. This RFC uses lint rules and a ratchet instead, because here tests live and change alongside the code they test.
7. Component tests are more trustworthy in a real browser and when written against what users see [16] [17].
8. No source studies snapshot tests in agent workflows. Banning them goes further than the sources, on the reasoning that a snapshot states no expected value and is regenerated by one flag. The section on agents also goes further than the sources: it applies their findings on feedback and test-gaming to the specific practices here.

## Alternatives considered

- **No unit tests; rely on types, lint and end-to-end tests.** Less to maintain. Not chosen because custom checks would never be shown to fail, data invariants are invisible to types and lint, and end-to-end tests are the slowest and flakiest way to find a logic bug [14].
- **Mostly end-to-end tests.** They test what users do, and one test covers a lot of code. Not chosen as the main layer because they are slow, flaky and imprecise [14]. They stay at the top of the pyramid for critical journeys.
- **Node's built-in runner everywhere.** No dependency. Not chosen as the default because it cannot import code that uses path aliases or imports without extensions [18]. It remains the right choice for projects that run directly on Node.
- **Jest.** The most widely used runner, with the same `describe`, `it` and `expect` shape. Not chosen because it needs a separate TypeScript transform and extra configuration for ES modules, where Vitest needs neither.
- **Component tests in jsdom.** Fast and widely used. Not chosen because a simulated browser can pass while the real page is broken [17]. Browser mode runs the same kind of test in a real browser.
- **Snapshots for rendered output.** Cheap to write and good at noticing any change. Not chosen because they state no expected behaviour and are regenerated with one flag.
- **Module mocks for isolation.** Fast tests with no setup. Not chosen because mocks couple tests to implementation and encode assumptions that can be wrong [7] [15]. Seams, fakes and real dependencies give the same isolation with real behaviour.
- **A coverage threshold.** Easy to measure and common in CI. Not chosen because it does not measure whether results are checked [8].
- **Automatic retries.** They keep the build green while flaky tests are investigated. Not chosen because unit tests have no legitimate source of flakiness, and retries hide the real ones [5].

## Tradeoffs and risks

- **Real dependencies cost setup.** A test database needs a container runtime, and integration tests take seconds. They run separately from unit tests, so the loop after each edit stays fast.
- **Seams change the shape of code.** Passing the time, a random source or a parser as a parameter adds an argument. The cost is small, and the same seams make code easier to reuse.
- **Saved API responses go stale.** A saved response shows what the API returned when it was saved. Contract tests, or refreshing saved responses when the API changes, keep them true.
- **The ratchet can be lowered on purpose.** An agent can still edit the baseline. The aim is that the edit is visible in review, not that it is impossible.
- **`vitest related` follows static imports only** [17]. Code loaded through dynamic imports does not select its tests. The full suite still runs them.
- **Some judgment remains.** No tool can decide whether a failing test or the code is wrong. That one rule stays in prose.

Revisit if the suite outgrows its time budget, if Node's runner gains path alias support, if flaky tests appear among unit tests, or if bugs reach users that a layer of the pyramid should have caught.
