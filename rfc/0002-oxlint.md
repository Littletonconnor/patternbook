# RFC 0002: Lint and format with the Oxc toolchain

## Summary

Coding agents drift. They copy whatever pattern they saw last, reach for `any` and type assertions when types get in the way, and leave promises unhandled. RFC 0001 places lint rules near the base of its priority pyramid because a lint rule catches these mistakes on every edit, deterministically, and tells the agent how to fix them. That only works if lint is fast enough to run after every edit and has rules for the mistakes that matter.

This RFC replaces ESLint with Oxlint for both reasons. Oxlint is 50 to 100 times faster than ESLint, and runs type-aware TypeScript rules 12 to 18 times faster than ESLint with typescript-eslint, according to its maintainers' benchmarks [[3]](#sources) [[5]](#sources). It ships more than 870 rules natively, including the type-safety, promise, import and React Compiler rules the current setup lacks [[3]](#sources). The RFC defines the rule set rule by rule, with the reason for each. It also replaces Prettier with oxfmt, the formatter from the same toolchain, which matches Prettier's output for JavaScript and TypeScript [[12]](#sources).

## Problem

Static analysis changes behaviour only when it runs early, blocks the change, and says what to do. Checks that run late or only warn are ignored [[2]](#sources). For coding agents, a linter that checks each edit raises the rate of correctly solved tasks [[1]](#sources). The current setup falls short of this in four ways.

### Lint is too slow to run on every edit

The value of a check falls the later its feedback arrives, because more code gets built on top of the mistake [[2]](#sources). ESLint runs as single-threaded JavaScript. Its type-aware rules, which need the TypeScript compiler to resolve types, are slower again: on public repositories they take 12 to 27 seconds where a native implementation takes about one [[5]](#sources). The current config avoids that cost by having no type-aware rules, which means the checks that matter most for agent code are missing.

### The rules that catch agent mistakes are missing

The current config enables two StyleX rules and the rules bundled with `eslint-config-next`. None of the checks below exist today. Each targets a mistake agents make when a type, an API or a framework pushes back: the fastest way past a type error is `any` or an assertion, the fastest way past an async error is to drop the `await`, and the fastest way past a stale render is another Effect. Strict published configs treat these rules as baseline [[8]](#sources) [[9]](#sources) [[11]](#sources). These are the twenty that matter most:

- `no-explicit-any`: declaring a value as `any`, which turns off type checking for it and everything it touches.
- `no-unsafe-assignment` and the rest of the `no-unsafe-*` family: an `any` value, often from `JSON.parse` or `fetch`, flowing into typed code, where the mistake surfaces at runtime far from its cause.
- `no-unsafe-type-assertion`: `value as Foo` where `Foo` is narrower than the real type, a claim the compiler does not check.
- `no-unnecessary-type-assertion`: assertions that change nothing and teach readers that assertions are normal.
- `no-non-null-assertion`: `value!`, which claims a value is never `null` and crashes when it is.
- `ban-ts-comment`: `@ts-ignore` and `@ts-expect-error`, which switch the compiler off for a line.
- `switch-exhaustiveness-check`: a `switch` on a union that misses a member, so a new case is not handled everywhere.
- `no-floating-promises`: an async call with no `await` or `.catch`, so a rejection disappears.
- `no-misused-promises`: an async function passed where a plain callback or condition is expected, so the promise is ignored or always truthy.
- `await-thenable`: `await` on a value that is not a promise, usually the wrong function called.
- `return-await`: returning a promise inside `try` without `await`, so the `catch` never sees the rejection.
- `only-throw-error`: throwing strings or plain objects, which carry no stack trace.
- `use-unknown-in-catch-callback-variable`: a `.catch` argument typed `any` instead of checked.
- `rules-of-hooks`: hooks called inside conditions or loops, which attaches state to the wrong hook.
- `exhaustive-deps`: an Effect or memo missing a dependency, so it runs with stale values.
- `set-state-in-effect`: state set inside an Effect when it could be computed during render, costing an extra render.
- `purity`: impure calls such as `Date.now()` during render, which break the React Compiler's assumptions.
- `eqeqeq`: `==` and `!=`, which coerce types so that `0 == ""` is true.
- `no-unused-vars`: variables and imports left behind after an edit, which mislead the next reader.
- `consistent-type-imports`: types imported with a normal `import`, mixing compile-time names into runtime imports.

### The enforced rules are not written down

Linters group their rules into categories, such as "correctness" for definite bugs or "style" for formatting preferences. Turning a category on enables every rule in it, including rules added in later releases. Presets work the same way: a config that extends a preset enables whatever the preset contains at the installed version.

That has two costs. The rule set changes on upgrade without anyone deciding it, so code that passed yesterday can fail today. And nobody, human or agent, can read the config to learn what is enforced. The current config inherits most of its rules from `eslint-config-next`, so the answer to "what does lint check here?" lives in a dependency. Strict configs avoid this by turning categories off, naming every rule, and using only errors, since a warning is a check nobody acts on [[2]](#sources) [[8]](#sources) [[9]](#sources).

### Formatting runs on a separate, slower toolchain

A formatter rewrites code into one fixed layout, so style never comes up in review and an agent never spends effort on it. That only holds if the format check runs as often as lint, which is why `verify` runs it on every change. Prettier is single-threaded JavaScript. Once lint moves to a native tool, the Prettier check becomes the slowest step in `verify`. A native formatter does the same job about 30 times faster [[12]](#sources).

Keeping Prettier also means maintaining two toolchains for one pass over the code: two parsers that can disagree when new syntax arrives, two configs, two editor integrations and two upgrade paths. The current setup even carries a third package, `eslint-config-prettier`, whose only purpose is to turn off lint rules that would fight the formatter. A formatter built on the same parser as the linter removes all of that coordination [[14]](#sources).

## Goals

1. **One linter.** `oxlint` is the only lint command. ESLint, `eslint-config-next` and `eslint-config-prettier` are removed from `package.json`.
2. **The config is the documentation.** Each enabled rule appears by name in `oxlint.config.ts` with severity `error`, and no category is enabled. Upgrading Oxlint without editing the config leaves the rule set unchanged.
3. **Fast enough for every edit.** Linting one file takes under one second, and the whole source tree, with type-aware rules, takes under two seconds.
4. **Zero violations at rest.** `oxlint` exits 0 on a clean checkout. Each rule lands with every existing violation fixed in the same change.
5. **Exceptions are visible.** Every exception is a named file-glob override in `oxlint.config.ts`. A search for disable directives in `src` returns nothing.
6. **Every rule has a reason.** Each rule in the config appears in this RFC or a later one, with why it is enabled.
7. **One formatter, same style.** `oxfmt --check` exits 0 and Prettier is removed. The existing options (line width 100, double quotes, trailing commas) are kept.

## Non-goals

- **The repository's own convention rules.** Token, comment, layer and naming rules come from RFC 0001, and each needs its own design. Part 4 shows how they plug in.
- **Test rules.** Vitest rules are added once the repository has a test runner.

## Proposal

The proposal has seven parts, in the order they have to be decided. The choice of linter comes first, because it sets which rules are available and how fast they run. The shape of the config comes second, because it keeps the rule set from changing without a decision. The rule set itself comes third. The remaining parts, closing escape hatches, switching the formatter and planning the migration, all build on those three.

### 1. Lint with Oxlint

Oxlint is a linter for JavaScript and TypeScript, written in Rust and multi-threaded, built on the Oxc parser. It reimplements the rules of ESLint and of its most used plugins (`typescript`, `react`, `jsx-a11y`, `import`, `unicorn`, `promise`, `nextjs`, `vitest`) natively, more than 870 in total [[3]](#sources).

**Why it is fast enough.** The maintainers' benchmark lints the same code in 0.6 seconds against 33.5 seconds for ESLint, and the largest reported run covered about 265,000 files in 22.5 seconds [[4]](#sources). Type-aware rules run on a native port of the TypeScript 7 compiler and are 12 to 18 times faster than typescript-eslint on four public repositories [[5]](#sources). All of these figures are self-reported. What matters here is the order of magnitude: whole-tree lint in about a second makes "run lint after every edit" practical.

**Why it covers the rules that matter.** Type-aware rules are the ones that catch unsafe `any`, unnecessary assertions and floating promises, and Oxlint supports nearly all of typescript-eslint's set (59 of 61 per the stable announcement, 60 of 62 per the current docs) [[5]](#sources) [[6]](#sources). React Compiler rules and the Next.js rules are native.

**Why one linter is enough.** Oxlint loads plugins written for ESLint's rule API as JavaScript plugins. StyleX's ESLint plugin and this repository's own rules run that way, so nothing is left for ESLint to do. This feature is labelled alpha [[3]](#sources).

The config is a typed `oxlint.config.ts` that exports `defineConfig(...)`, so rule names and options are checked by the compiler [[6]](#sources).

### 2. Config shape

```
oxlint.config.ts        The whole config: options, plugins, rules, overrides
lint/
  plugin.ts             Registers the local rules below as a JavaScript plugin
  rules/<rule>.ts       One file per local rule
```

Oxlint groups its rules into categories: `correctness` (code that is definitely wrong), `suspicious` (code that is probably wrong), `pedantic`, `perf`, `style`, `restriction` and `nursery` (unfinished rules). By default it enables `correctness` as warnings [[3]](#sources). This config changes that default, for the reasons in the Problem section:

- **Every category off, every rule named.** A new Oxlint release can add rules to a category, but never to this repository. Reading the config tells you exactly what is checked.
- **Errors only.** No rule is set to `warn`. A rule either blocks the change or is not in the config.
- **Type-aware on.** `typeAware: true`. The type-safety and promise rules need to know each value's type, and they are the rules that catch the mistakes agents make most.
- **Stale disables fail.** `reportUnusedDisableDirectives: 'error'`. A disable comment that no longer suppresses anything is noise that tells the next reader, or agent, that disabling rules is normal here.
- **Exceptions as named overrides.** On TypeScript files, core rules the compiler already enforces (`no-undef`, `no-redeclare`, `no-dupe-keys` and similar) are off, and `no-throw-literal` gives way to its type-aware version, `typescript/only-throw-error`. Plain JavaScript config files skip type-aware rules. Next.js special files (`page.tsx`, `layout.tsx` and the rest) may use default exports and framework file names, because Next.js requires them.

### 3. The rule set

Leaving these rules unenforced has three costs.

- **Runtime behaviour.** Every rule below catches code the TypeScript compiler accepts but that fails or misbehaves when it runs: a promise rejection that disappears, a crash on a value assumed not to be `null`, an Effect that reads stale state, a comparison that is always false. Without the rule, the first sign of the problem is a bug in production.
- **Agents writing worse code.** An agent learns a codebase's conventions from the code it reads and the feedback it gets. When nothing rejects a pattern, the agent has no reason to avoid it, so it repeats it, and each copy becomes an example the next edit imitates. A rule that fails the edit, with a message that names the fix, stops the pattern the first time it appears instead of after it has spread [[1]](#sources) [[2]](#sources).
- **People reasoning about the code.** Most new code in this repository is written by agents and read by people. Code that mixes several forms of the same operation, hides errors, or overrides the type checker is harder to review, because the reader has to verify by hand what a rule could have guaranteed. A clean lint run lets a reviewer trust that whole classes of problems are absent and spend their attention on the design.

Each group below names the kind of mistake it prevents and why it matters, then lists its rules with what each one reports.

#### Definite bugs

These rules report code that cannot be correct: it throws, does nothing, or does something other than what it says. At runtime each one is a bug waiting for the right input. Agents produce them when they edit part of a file without reading the rest, such as a key added to an object that already has it, or a condition copied into the wrong branch. They are also the mistakes people miss most easily in review, because the code looks plausible line by line. A rule finds them every time, at no cost, so there is no reason to leave any of them off.

- **Writing to something that should not change.**
  - `no-const-assign`: reassigning a `const`.
  - `no-class-assign`, `no-func-assign`: reassigning a class or function declaration.
  - `no-import-assign`: assigning to an imported binding.
  - `no-global-assign`: overwriting a built-in such as `window` or `Object`.
  - `no-ex-assign`: reassigning the error in a `catch` block.
  - `no-delete-var`: `delete` on a variable, which never works.
  - `no-shadow-restricted-names`: naming a variable `undefined`, `NaN` or `Infinity`.
  - `no-redeclare`, `no-dupe-class-members`: declaring the same name twice, so one silently replaces the other.
- **Duplicates where only one copy takes effect.**
  - `no-dupe-keys`: the same key twice in an object literal.
  - `no-duplicate-case`: the same `case` twice in a `switch`.
  - `no-dupe-else-if`: the same condition twice in an `if` chain, so the second branch never runs.
  - `typescript/no-duplicate-enum-values`: two enum members with the same value.
  - `typescript/no-duplicate-type-constituents`: `A | A` in a union or intersection.
- **Comparisons that are always true, always false, or not what was meant.**
  - `no-constant-condition`, `no-constant-binary-expression`: a condition whose result is fixed, such as `if (x = 1)` or `a ?? b` on a value that is never null.
  - `no-cond-assign`: `=` where `===` was meant.
  - `no-self-compare`: comparing a value with itself.
  - `no-compare-neg-zero`: comparing with `-0`, which equals `0`.
  - `use-isnan`: comparing with `NaN`, which is never equal to anything.
  - `valid-typeof`: comparing `typeof` with a misspelled type name.
  - `no-unsafe-negation`: `!a in b` where `!(a in b)` was meant.
  - `oxc/bad-comparison-sequence`: `a < b < c`, which does not mean what it reads as.
  - `oxc/bad-char-at-comparison`: comparing `charAt()` with a string longer than one character.
  - `oxc/bad-object-literal-comparison`: comparing with `{}` or `[]`, which is never equal.
  - `oxc/const-comparisons`, `oxc/double-comparisons`: range checks that can never pass, or that repeat each other.
  - `oxc/bad-min-max-func`: `Math.min(Math.max(...))` with the bounds swapped, which always returns a constant.
  - `oxc/bad-bitwise-operator`: `|` or `&` where `||` or `&&` was meant.
  - `oxc/misrefactored-assign-op`: `a += a + b` where `a += b` was meant.
  - `for-direction`: a `for` loop whose counter moves away from its end condition.
- **Code that never runs, or runs when it should not.**
  - `no-unreachable`: code after `return`, `throw`, `break` or `continue`.
  - `no-fallthrough`: a `switch` case that runs into the next one without a `break`.
  - `no-unsafe-finally`: `return` inside `finally`, which discards the error or value from `try`.
  - `no-unexpected-multiline`: a line break that joins two statements into one call.
  - `no-case-declarations`: a `let` or `const` inside a `case` without braces, shared across cases.
  - `no-useless-catch`: a `catch` that only rethrows.
  - `no-unused-labels`: a label nothing jumps to.
  - `oxc/missing-throw`: `new Error()` created but never thrown.
- **Results that are computed and then lost.**
  - `array-callback-return`: a `map`, `filter` or `reduce` callback that does not return.
  - `getter-return`: a getter that does not return.
  - `no-setter-return`: a setter that returns a value nobody receives.
  - `require-yield`: a generator that never yields.
  - `oxc/uninvoked-array-callback`: `new Array(n).map(...)`, whose callback never runs because the array is empty.
  - `no-unused-expressions`: an expression that has no effect, such as a function named but not called.
  - `no-self-assign`: `x = x`.
  - `no-useless-assignment`: a value assigned and then overwritten before it is read.
- **Classes used incorrectly.**
  - `constructor-super`, `no-this-before-super`: a subclass constructor that skips `super()` or uses `this` before it.
  - `typescript/no-misused-new`: declaring a constructor in an interface.
  - `typescript/no-unsafe-declaration-merging`: an interface and class with the same name, which merge silently.
  - `typescript/unbound-method`: passing a method without its object, so `this` is lost.
  - `typescript/no-unnecessary-parameter-property-assignment`: assigning a constructor parameter property twice.
  - `no-unused-private-class-members`: private fields or methods nothing uses.
  - `no-empty-static-block`: an empty `static {}` block.
- **Broken regular expressions and strings.**
  - `no-invalid-regexp`: a regular expression that throws when built.
  - `no-empty-character-class`: `[]` in a regular expression, which matches nothing.
  - `no-control-regex`: invisible control characters in a regular expression.
  - `no-misleading-character-class`: emoji or combined characters in a character class, which split apart.
  - `no-useless-backreference`: a backreference that can never match.
  - `no-regex-spaces`: several spaces in a row, which are hard to count.
  - `no-useless-escape`, `no-nonoctal-decimal-escape`: escapes that do nothing or that mean something unexpected.
  - `no-irregular-whitespace`: invisible non-standard spaces in code.
  - `oxc/bad-replace-all-arg`: `replaceAll` with a regular expression missing the `g` flag, which throws.
- **Numbers that are not what they look like.**
  - `no-loss-of-precision`: number literals too precise to be stored exactly.
  - `oxc/approx-constant`: hand-typed approximations of `Math.PI` and similar constants.
  - `oxc/number-arg-out-of-range`: an out-of-range argument, such as `toFixed(101)`.
  - `typescript/no-unsafe-unary-minus`: `-` applied to a value that is not a number.
- **Built-ins used the wrong way.**
  - `no-obj-calls`: calling `Math()` or `JSON()` as a function.
  - `no-new-native-nonconstructor`: `new Symbol()` or `new BigInt()`, which throw.
  - `no-new-wrappers`, `typescript/no-wrapper-object-types`: `new String()` or the type `String` instead of `string`.
  - `no-array-constructor`: `new Array(1, 2)`, which behaves differently with one argument.
  - `no-sparse-arrays`: holes in an array literal, such as `[1, , 3]`.
  - `no-prototype-builtins`, `prefer-object-has-own`: `obj.hasOwnProperty(key)`, which breaks on objects without a prototype. Use `Object.hasOwn`.
  - `typescript/no-array-delete`: `delete` on an array element, which leaves a hole.
  - `typescript/no-for-in-array`: `for...in` over an array, which iterates keys as strings.
  - `typescript/require-array-sort-compare`: `sort()` without a compare function, which sorts numbers as strings.
  - `typescript/no-misused-spread`: spreading a string or a class instance, which gives unexpected results.
  - `oxc/no-accumulating-spread`: spreading the accumulator inside `reduce`, which is quadratic.
  - `no-unsafe-optional-chaining`: using `a?.b` where `undefined` would throw, such as `new (a?.b)()`.
  - `no-extra-boolean-cast`, `no-extra-bind`, `no-empty-pattern`, `no-useless-rename`: casts, binds, destructuring and renames that do nothing.
- **Legacy and unsafe language features.**
  - `no-var`: `var`, which ignores block scope.
  - `no-with`: the `with` statement.
  - `no-implied-eval`: passing a string to `setTimeout` or `setInterval`, which evaluates it as code.
  - `no-debugger`: `debugger` statements.
  - `no-undef`: using a variable that is not declared.
  - `typescript/no-require-imports`: `require()` instead of `import`.
  - `typescript/triple-slash-reference`: `/// <reference>` instead of `import`.
  - `typescript/no-unsafe-function-type`: the type `Function`, which accepts anything callable.
  - `typescript/no-empty-object-type`: the type `{}`, which means "anything but null", not "empty object".
  - `typescript/no-unnecessary-type-constraint`: `<T extends unknown>`, which constrains nothing.
  - `typescript/prefer-as-const`: `"a" as "a"` instead of `as const`.
- **Broken module graphs.**
  - `import/no-self-import`: a file importing itself.
  - `import/export`: the same name exported twice.

#### Type safety

A value typed `any`, or forced to a type with an assertion, skips the compiler's checks, and the mistake shows up at runtime far from its cause. Agents reach for both because they are the fastest way past a type error, and once one exists, the next edit copies it. For a reader, every `any` or assertion is a point where the types can no longer be trusted, so the code around it has to be checked by hand. These rules require the value to be checked or parsed instead.

- `typescript/no-unsafe-argument`, `no-unsafe-assignment`, `no-unsafe-call`, `no-unsafe-member-access`, `no-unsafe-return`: an `any` value passed, assigned, called, read or returned into typed code. Data from `JSON.parse`, `fetch` and URL parameters is the usual source, and must be parsed where it enters.
- `typescript/no-explicit-any`: declaring something as `any`.
- `typescript/consistent-type-assertions` with `assertionStyle: 'never'`: any `as` assertion except `as const`, as RFC 0001 requires.
- `typescript/no-unsafe-type-assertion`, `no-unnecessary-type-assertion`: assertions that narrow without checking, or change nothing. These still apply in files where the assertion ban is overridden.
- `typescript/no-non-null-assertion` and its variants (`no-confusing-non-null-assertion`, `no-extra-non-null-assertion`, `no-non-null-asserted-nullish-coalescing`, `no-non-null-asserted-optional-chain`): the `!` operator, which claims a value is never `null` without checking.
- `typescript/ban-ts-comment`, also banning `@ts-expect-error`: comments that switch the compiler off for a line.
- `typescript/switch-exhaustiveness-check`: a `switch` on a union that misses a member, so a new member must be handled everywhere.
- `typescript/consistent-type-definitions` set to `type`: one way to declare object types, so agents do not mix `type` and `interface` and readers do not wonder whether the difference matters.
- `typescript/array-type` set to `array`: one way to write array types, `T[]`, for the same reason.

#### Promises and errors

A promise that is never awaited loses its error silently, and throwing something other than an `Error` loses the stack trace. At runtime the failure appears somewhere unrelated, or not at all. Agents drop an `await` easily, because the code still compiles and usually works on the happy path. A reviewer cannot tell from a diff whether a missing `await` was deliberate, so only a rule can answer it.

- `typescript/no-floating-promises`: an async call with no `await`, `.catch` or `void`.
- `typescript/no-misused-promises` with `checksVoidReturn: { attributes: false }`: a promise passed where a plain callback or condition is expected. The option allows async event handlers in JSX, which React supports.
- `typescript/await-thenable`: `await` on a value that is not a promise.
- `typescript/return-await` set to `error-handling-correctness-only`: returning a promise inside `try` without `await`, so `catch` never sees the rejection.
- `typescript/only-throw-error`, `no-throw-literal`: throwing a string or plain object.
- `prefer-promise-reject-errors`: rejecting a promise with something other than an `Error`.
- `preserve-caught-error`: rethrowing a new error without passing the original as its `cause`.
- `typescript/use-unknown-in-catch-callback-variable`: a `.catch` argument typed `any`.
- `no-async-promise-executor`, `no-promise-executor-return`: an `async` function or a `return` inside `new Promise(...)`, where errors and values are lost.
- `promise/no-multiple-resolved`: resolving the same promise twice.
- `promise/no-return-in-finally`: returning from `.finally()`, which is ignored.
- `no-empty`: an empty block, often a `catch`, that hides a failure.

#### Modules and imports

Imports are how a reader, or an agent, works out what a file depends on. Mixed import styles hide which imports exist only for types, and default exports let the same thing be imported under different names in different files, which makes search and refactoring unreliable.

- `typescript/consistent-type-imports`, `import/consistent-type-specifier-style` set to `prefer-top-level`, `typescript/no-import-type-side-effects`: types imported with `import type`. Type imports are erased at build time, and marking them keeps them out of runtime code.
- `import/no-namespace`, ignoring `@stylexjs/stylex`: `import * as x`. Named imports show what a file uses. StyleX is exempt because `import * as stylex` is its documented form.
- `import/no-default-export`: default exports, since RFC 0001 requires named exports. Next.js special files get an override, because the framework requires default exports.
- `unicorn/filename-case`, camelCase or PascalCase: file names, as RFC 0001 requires, so a file can be found from the name of what it exports. Framework file names get an override.

#### React

React bugs rarely throw. A missing dependency or state set inside an Effect renders the wrong thing or renders too often, and the page still looks mostly right, so the bug survives until a user hits it. Agents write these patterns often because an Effect is the quickest way to make something update. They are hard to catch in review because the mistake is usually something missing, not something present.

- **Hooks and the React Compiler.** These report components the React Compiler cannot optimise safely, and are the mechanical form of RFC 0001's restriction on Effects [[11]](#sources).
  - `rules-of-hooks`: hooks called inside conditions, loops or nested functions.
  - `exhaustive-deps`: an Effect or memo that reads a value missing from its dependency list.
  - `set-state-in-effect`: state set directly inside an Effect.
  - `set-state-in-render`: state set during render, which loops.
  - `purity`: impure calls such as `Date.now()` or `Math.random()` during render.
  - `refs`: reading or writing `ref.current` during render.
  - `immutability`: mutating props, state or values React has already seen.
  - `static-components`: components defined inside other components, which remount on every render.
  - `preserve-manual-memoization`, `use-memo`: `useMemo` and `useCallback` written in a way the compiler cannot keep.
  - `incompatible-library`, `unsupported-syntax`, `globals`: libraries, syntax and global writes the compiler cannot handle.
  - `error-boundaries`: `try`/`catch` around JSX, which does not catch render errors.
- **JSX mistakes.**
  - `jsx-key`: list items without a `key`.
  - `jsx-no-duplicate-props`: the same prop twice.
  - `jsx-no-undef`: a component that is not imported.
  - `jsx-no-comment-textnodes`: `// comment` inside JSX, which renders as text.
  - `no-unescaped-entities`: characters such as `>` or `"` that should be escaped in JSX text.
  - `no-unknown-property`: DOM attributes React does not recognise, such as `class`.
  - `no-children-prop`, `no-danger-with-children`, `void-dom-elements-no-children`: children passed in ways React ignores or rejects.
  - `jsx-props-no-spread-multi`: spreading the same object twice.
  - `button-has-type`: a `<button>` without `type`, which defaults to submitting a form.
  - `checked-requires-onchange-or-readonly`: a checked input that cannot be changed.
  - `display-name`: components without a name in error messages and DevTools.
- **Security.**
  - `jsx-no-script-url`: `javascript:` URLs.
  - `jsx-no-target-blank`: `target="_blank"` without `rel="noreferrer"`.
- **Legacy class-component APIs.** `no-direct-mutation-state`, `no-find-dom-node`, `no-is-mounted`, `no-render-return-value`, `no-string-refs` and `require-render-return` report APIs that are removed or deprecated.

#### One way to write each thing

JavaScript usually offers several ways to do the same thing, such as `let` or `const`, `indexOf` or `includes`, `==` or `===`. Agents copy whichever form appears in the code they read last, so without a rule the codebase ends up with all of them. That costs readers: when two pieces of code use different forms, a reader has to stop and work out whether the difference means something. Picking one form for each operation means a difference in the code is always a real difference in behaviour.

Several of these rules also prevent bugs, because the form they reject is the one that behaves unexpectedly.

- **Forms that hide bugs.**
  - `curly`: an `if` or loop body without braces. A second line added later looks guarded but always runs.
  - `eqeqeq`, including `null`: `==` and `!=`, which convert types before comparing, so `0 == ""` is true.
  - `unicorn/no-array-fill-with-reference-type`: `new Array(n).fill({})`, which puts the same object in every slot.
  - `unicorn/no-invalid-fetch-options`, `unicorn/no-invalid-remove-event-listener`: `fetch` and `removeEventListener` calls written so that they silently do nothing.
  - `unicorn/consistent-function-scoping`: a function that uses nothing from its surroundings but is defined inside another function, so it is rebuilt on every call or render.
- **Code that should not ship.**
  - `no-console`: leftover debug output.
  - `no-eval`: running a string as code.
  - `no-unused-vars`: variables, imports and parameters nothing uses, usually left behind by an edit.
- **Variables, objects and functions.**
  - `prefer-const`: `let` for a variable that is never reassigned, so a reader knows it will not change.
  - `object-shorthand`: `{ name: name }` instead of `{ name }`.
  - `prefer-arrow-callback`: `function` expressions as callbacks, where an arrow function keeps `this` predictable.
  - `prefer-rest-params`, `prefer-spread`: the old `arguments` object and `.apply()`, instead of `...args`.
- **Arrays.**
  - `unicorn/prefer-array-some`, `unicorn/prefer-array-index-of`, `unicorn/prefer-array-flat-map`, `unicorn/prefer-at`: the built-in method that says what the code means, such as `some()` instead of `find() !== undefined`, and `at(-1)` instead of `arr[arr.length - 1]`.
  - `unicorn/no-magic-array-flat-depth`, `unicorn/consistent-empty-array-spread`, `unicorn/no-useless-spread`: unexplained `flat()` depths and spreads that copy for no reason.
  - `unicorn/prefer-set-has`, `unicorn/prefer-set-size`: a `Set` for repeated membership checks, and its `size` for counting.
- **Strings and numbers.**
  - `unicorn/prefer-string-replace-all`: `replaceAll` instead of `replace` with a global regular expression.
  - `unicorn/prefer-string-slice`, `unicorn/prefer-string-raw`: one way to cut strings, and raw strings instead of escaped backslashes.
  - `unicorn/prefer-number-properties`, `unicorn/prefer-native-coercion-functions`: `Number.isNaN` instead of the global `isNaN`, and `Boolean` instead of `x => !!x`.
  - `unicorn/numeric-separators-style`, `unicorn/no-hex-escape`, `unicorn/text-encoding-identifier-case`: readable large numbers, Unicode escapes, and `"utf-8"` spelled one way.
- **Errors and async.**
  - `unicorn/catch-error-name`: the caught value is always called `error`.
  - `unicorn/prefer-optional-catch-binding`: `catch {}` when the error is not used.
  - `unicorn/no-useless-promise-resolve-reject`: `return Promise.resolve(x)` inside an `async` function, where `return x` does the same.
- **Everything else.**
  - `unicorn/no-typeof-undefined`: `typeof x === "undefined"` instead of `x === undefined`.
  - `unicorn/no-unnecessary-slice-end`: `slice(i, arr.length)` instead of `slice(i)`.
  - `unicorn/prefer-single-call`: several `push` calls in a row instead of one.
  - `unicorn/prefer-structured-clone`: `structuredClone` instead of `JSON.parse(JSON.stringify(x))`.
  - `unicorn/prefer-dom-node-append`: `append` instead of `appendChild`.
  - `unicorn/prefer-node-protocol`: `node:fs` instead of `fs`, so built-in modules are obvious.

#### Rules considered and left out

Strict published configs enable these [[8]](#sources) [[9]](#sources) [[10]](#sources). This RFC does not.

- **Relay type checks and the `instanceof` ban.** The repository does not use Relay, and `unicorn/no-instanceof-builtins` covers built-in types natively.
- **`require-use-effect-arguments`.** `react/exhaustive-deps` and the Effect restriction already cover it.
- **`no-chained-type-assertions`, `no-widen-then-assert`.** Assertions are banned outright, so rules about combining them add nothing.
- **`no-unsafe-dictionary-type`.** The compiler option `noUncheckedIndexedAccess` covers it.
- **`no-object-parameters`.** It conflicts with React props, which are object parameters by design.
- **`no-array-filter-map` and similar code-quality rules.** Each would be a local rule to maintain. They are added through RFC 0001's correction loop if the pattern recurs.
- **`perfectionist` sorting rules.** `stylex/sort-keys` already sorts style objects. Sorting every other object and prop list changes most files without catching bugs.
- **`prefer-namespace-keyword`, `prefer-import-meta-properties`, `prefer-top-level-await`.** Namespaces are banned, and the Node module patterns do not occur in a Next.js app.
- **`no-warning-comments`.** The no-comments rule covers it.

### 4. Framework, library and repository rules

The rule set in part 3 is general JavaScript, TypeScript and React. This codebase also depends on Next.js and StyleX, which each have their own ways to go wrong, and on conventions of its own from RFC 0001. Each of those rule sets reaches Oxlint in a different way, and none of them is copied into this repository.

**How a rule gets into Oxlint.** There are three routes, and all three end the same way: the rule is named in `oxlint.config.ts`, set to `error`, and fails `oxlint` like any other rule.

1. **Native plugins.** Oxlint reimplements the rules of the most used ESLint plugins in Rust [[3]](#sources). Turning one on is a line in `plugins`, then each rule is named. Nothing is installed or copied.
2. **JavaScript plugins.** For a plugin Oxlint has not reimplemented, it loads the published ESLint plugin package itself, through its implementation of ESLint's rule API [[3]](#sources). The package stays an ordinary dev dependency, upgraded like any other.
3. **Local rules.** Rules for conventions only this repository has are written here, in `lint/rules/`, and loaded as one more JavaScript plugin by `lint/plugin.ts`.

In config, the three routes look like this:

```ts
export default defineConfig({
  plugins: ["typescript", "react", "nextjs", "jsx-a11y", "import", "unicorn", "promise", "oxc"],
  jsPlugins: ["@stylexjs/eslint-plugin", "./lint/plugin.ts"],
  rules: {
    "nextjs/no-img-element": "error",
    "@stylexjs/valid-styles": "error",
    "patternbook/no-comments": "error",
  },
});
```

**Next.js, through the native plugin.** Today these rules arrive through `eslint-config-next`, which wraps `@next/eslint-plugin-next` together with React, hooks, import and accessibility presets. Oxlint's native `nextjs` plugin reimplements the Next.js plugin's 21 rules [[3]](#sources), and the React, hooks, import and accessibility rules are covered by part 3 and the `jsx-a11y` plugin, so `eslint-config-next` can be removed with nothing lost. The Next.js rules catch framework misuse that compiles and renders but costs performance or correctness, such as a plain `<img>` where `next/image` resizes and lazy-loads, an `<a>` to an internal page where `Link` keeps client-side navigation, or a synchronous `<script>` that blocks rendering. Agents trained on general React code write these often, because the plain HTML element is the obvious choice outside Next.js.

**StyleX, through its own published plugin.** Oxlint has no native StyleX rules, so it loads `@stylexjs/eslint-plugin`, the same package the current ESLint config uses. StyleX compiles styles at build time, and its rules report styles the compiler cannot handle or that behave unexpectedly:

- `valid-styles`: property names and values StyleX cannot compile.
- `no-unused`: styles defined but never applied.
- `valid-shorthands`: shorthand properties such as `margin: "0 4px"` that StyleX cannot expand reliably.
- `sort-keys`: one order for style keys, so diffs show real changes.
- `enforce-extension`: shared variables defined outside a `.stylex.ts` file, which the compiler requires.
- `no-conflicting-props`: `className` or `style` passed alongside StyleX props, where one silently overrides the other.
- `no-legacy-contextual-styles`: the old syntax for media queries and pseudo-classes.

**Accessibility, through the native plugin.** The `jsx-a11y` rules report markup that screen readers and keyboards cannot use, such as images without alt text or click handlers on elements that cannot take focus. These problems are invisible in a screenshot, which is how agents usually check their work.

**This repository's conventions, through configuration and local rules.** RFC 0001 sets conventions no published plugin knows about. Some need only an existing rule: `no-restricted-imports`, configured to enforce layer direction and to require the wrapped versions of Base UI, `next/link` and Lucide, and `no-nested-ternary`, which keeps conditional rendering readable. The rest are local rules: no comments, typography and colour only from tokens, Effects and timers only in diagram hooks, no `enum`, and the spacing ratchet. Each local rule is designed on its own, with an error message that names the fix.

### 5. Closing escape hatches

A rule only prevents drift if it cannot be switched off quietly. Oxlint lacks two ESLint features that help with this [[3]](#sources):

- **No `no-restricted-syntax`.** ESLint can ban any code shape with an AST selector in config. Oxlint cannot, so each such ban becomes a small local rule in `lint/rules/`, with an error message that names the fix.
- **No option to ignore inline disable comments.** ESLint can refuse `// eslint-disable` comments entirely; Oxlint cannot. Three things replace it: the no-comments rule reports disable comments like any other comment, `unicorn/no-abusive-eslint-disable` rejects disables that name no rule, and `reportUnusedDisableDirectives` rejects disables that no longer suppress anything. A disable comment at the top of a file could still switch those off, so `verify` also fails if `oxlint-disable` or `eslint-disable` appears anywhere in `src`.

### 6. Formatting: Prettier and oxfmt

#### What each tool does

- **Prettier** is a formatter. It reprints every file in one canonical layout (line width, indentation, quotes, commas), so style is never discussed or reviewed. It never changes what the code does and never reports bugs.
- **Oxlint** is a linter. It reads code and reports patterns that are wrong, unsafe, or against the agreed rules. Layout is not its job.
- **Oxfmt** is a formatter from the same project as Oxlint, built as a replacement for Prettier. It does Prettier's job, uses Prettier's output as its baseline, and shares Oxlint's parser [[14]](#sources).

A formatter decides how code looks; a linter decides whether it is acceptable. A repository needs one of each, so the question here is only which formatter.

#### How oxfmt compares with Prettier

|                    | Prettier                                  | Oxfmt                                                                                                                       |
| ------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Output             | The reference                             | Passes 100% of Prettier's JavaScript and TypeScript conformance tests [[12]](#sources)                                      |
| Languages          | JS, TS, JSON, CSS, Markdown, MDX and more | Native for JS, TS, JSON, CSS, YAML, Markdown, HTML and others; MDX is handed to a bundled copy of Prettier [[13]](#sources) |
| Config             | `.prettierrc`                             | Same option names in `.oxfmtrc.json`; `oxfmt --migrate prettier` converts the file [[12]](#sources)                         |
| Default line width | 80                                        | 100 [[12]](#sources)                                                                                                        |
| Plugins            | Yes                                       | Not yet; on the roadmap [[12]](#sources)                                                                                    |
| Built in           | Formatting only                           | Also import sorting, Tailwind class sorting and `package.json` sorting [[12]](#sources)                                     |
| Speed              | Baseline                                  | About 30 times faster, self-reported [[12]](#sources)                                                                       |
| Maturity           | Stable for years                          | Beta since February 2026 [[12]](#sources)                                                                                   |

What this means for this repository:

- **The style carries over.** `.prettierrc` sets line width 100, double quotes, semicolons and trailing commas, all options oxfmt reads [[12]](#sources).
- **No plugins are lost.** The repository uses none.
- **MDX keeps working, through Prettier.** Lessons are MDX files, which oxfmt passes to the Prettier copy inside its npm package. No separate Prettier install is needed, but the standalone oxfmt binary skips these files [[13]](#sources).
- **Expect a small one-time diff.** Oxfmt deliberately differs from Prettier where it considers Prettier's output a bug [[14]](#sources).

#### Pros and cons

Pros:

- One toolchain and one parser for linting and formatting, and `eslint-config-prettier` goes away.
- Format checks are fast enough to run with lint after every edit.
- Import and `package.json` sorting are built in, removing two sources of noisy diffs without plugins.
- The existing config converts with one command.

Cons:

- Oxfmt is beta, so its output may still change between releases and cause reformatting.
- MDX still goes through Prettier, so lessons get no speed benefit and two formatters run underneath.
- No plugins, which would matter if a Prettier plugin were needed later.
- Switching costs one repository-wide formatting commit.

#### Recommendation

This RFC proposes switching to oxfmt. The repository uses no plugins and its options already match oxfmt's defaults, so the main risk is beta churn, and pinning the exact version contains that. Import sorting is turned on. The switch lands as its own commit after the lint migration, so formatting changes do not mix with rule fixes.

### 7. Migration

The migration is ordered so that lint never fails on `main` and every change stays small enough to review.

1. Add `oxlint.config.ts` with every rule above. Rules the current code breaks start off, so the switch itself passes.
2. Remove ESLint and its configs. The `lint` script becomes `oxlint`.
3. Turn each disabled rule on in its own change, fixing everything it reports in that change. One rule per change keeps each diff about one kind of fix. Autofixable rules go first because they cost the least.
4. Run `oxfmt --migrate prettier`, turn on import sorting, reformat in one commit, and remove Prettier. `format` and `format:check` become `oxfmt` and `oxfmt --check`. Formatting lands last and alone, so layout changes never hide a rule fix in review.

`verify` keeps its shape: format check, lint, type-check.

## Research

### Sources

| #   | Source                                                                                                                                                             | Type                           | What it says                                                                                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | [Yang et al. 2024, SWE-agent](https://arxiv.org/abs/2405.15793)                                                                                                    | Peer-reviewed (NeurIPS)        | A linter guarding edits raised agent resolution from 15.0% to 18.0%.                                                                            |
| 2   | [Sadowski et al. 2018, Lessons from building static analysis tools at Google](https://research.google/pubs/lessons-from-building-static-analysis-tools-at-google/) | Peer-reviewed (CACM), industry | Checks must be early, actionable and blocking; warnings are ignored.                                                                            |
| 3   | [Oxc, Oxlint overview](https://oxc.rs/docs/guide/usage/linter) and [rule reference](https://oxc.rs/docs/guide/usage/linter/rules/)                                 | Official docs                  | More than 870 rules in categories; 50 to 100 times faster than ESLint; JavaScript plugins are alpha; no `no-restricted-syntax`.                 |
| 4   | [Oxc 2025, Oxlint v1.0 Stable](https://oxc.rs/blog/2025-06-10-oxlint-stable)                                                                                       | Official announcement          | 615 ms against 33.5 s for ESLint on the same code; 264,925 files in 22.5 s; adopters include Shopify, Airbnb and Mercedes-Benz. Self-reported.  |
| 5   | [Oxc 2026, Type-Aware Linting Stable](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable)                                                                    | Official announcement          | Built on TypeScript 7; 59 of 61 type-aware rules; 12 to 18 times faster than ESLint with typescript-eslint on four repositories. Self-reported. |
| 6   | [Oxc, Type-aware linting docs](https://oxc.rs/docs/guide/usage/linter/type-aware.html)                                                                             | Official docs                  | 60 of 62 rules; notes incomplete coverage and high memory on very large codebases; compiler options removed in TypeScript 7 must be migrated.   |
| 7   | [Cloudflare agents, issue 862](https://github.com/cloudflare/agents/issues/862)                                                                                    | Engineering report             | Deferred type-aware Oxlint over alpha status, TypeScript 7 config semantics, memory on large repositories and an extra CI binary.               |
| 8   | [Cloudflare, @cloudflare/oxlint-config 0.1.0](https://github.com/cloudflare/oxlint-config)                                                                         | Industry config                | Categories off, every rule at error, type-aware on; adds strict equality, unsafe-`any`, promise-safety and type-only import rules.              |
| 9   | [Nakazawa, @nkzw/oxlint-config 3.0.0](https://github.com/nkzw-tech/oxlint-config)                                                                                  | Industry config                | About 200 explicitly listed rules; errors, never warnings; slow and subjective rules avoided.                                                   |
| 10  | [Mulroy, anti-slop](https://github.com/dmmulroy/anti-slop)                                                                                                         | Open-source rule set           | Code-quality rules aimed at patterns common in generated code.                                                                                  |
| 11  | [React, eslint-plugin-react-hooks lints](https://react.dev/reference/eslint-plugin-react-hooks)                                                                    | Official docs                  | React Compiler rules such as `purity`, `refs` and `set-state-in-effect`.                                                                        |
| 12  | [Oxc 2026, Oxfmt Beta](https://oxc.rs/blog/2026-02-24-oxfmt-beta)                                                                                                  | Official announcement          | 100% of Prettier's JS/TS conformance tests; about 30 times faster than Prettier; import, Tailwind and `package.json` sorting; no plugins yet.   |
| 13  | [Oxc, Oxfmt language support](https://oxc.rs/docs/guide/usage/formatter/language-support.html)                                                                     | Official docs                  | Native languages; MDX and others delegated to a bundled Prettier in the npm package.                                                            |
| 14  | [Oxc, Oxfmt overview](https://oxc.rs/docs/guide/usage/formatter)                                                                                                   | Official docs                  | Prettier output as baseline with deliberate divergences; stay on Prettier only for plugins oxfmt lacks.                                         |
| 15  | [RFC 0001: Agent-first repository](0001-agent-first-repo.md)                                                                                                       | This repository                | The priority pyramid and the conventions these rules enforce.                                                                                   |

Speed figures in sources 3, 4, 5, 12 and 14 come from the tools' maintainers. Sources 5 and 6 disagree on type-aware rule totals, and sources 12 and 14 disagree on oxfmt's speed relative to Biome (3 times against 2 times). Not read: oxfmt's list of known divergences from Prettier.

### What we learned

1. The speed claims are self-reported, but they agree across announcements and are backed by large adopters. The order of magnitude, not the exact figure, is what makes per-edit linting practical [3] [4] [5].
2. The strongest counter-evidence is an engineering team deferring type-aware Oxlint because it was alpha, required TypeScript 7 config semantics, used a lot of memory on large repositories and added a binary to CI [7]. Type-aware linting has since been declared stable [5]. This repository is small, is not a monorepo, and uses no compiler options removed in TypeScript 7, so the remaining concerns do not apply.
3. Strict configs agree more on discipline than on individual rules: categories off, every rule named, errors only [8] [9]. They differ on style rules, which this RFC decides one by one.
4. Oxlint lacks selector bans and a way to refuse disable comments [3]. Both have workable substitutes, at the cost of owning a few local rules.
5. Oxfmt matches Prettier on JavaScript and TypeScript, but is younger, has no plugins, and still sends MDX through Prettier [12] [13]. This RFC goes further than its sources in judging those gaps acceptable, on the basis that the repository uses no plugins.

## Alternatives considered

- **Extend a published preset.** Least work, and maintained upstream. Not chosen because every preset includes rules this codebase does not want, and preset releases would change the rule set without a decision here, which is the drift this RFC removes.
- **Keep ESLint and add the same rules.** No migration, and selector bans keep working. Not chosen because type-aware rules through typescript-eslint are an order of magnitude slower [5], which works against running lint after every edit.
- **Run Oxlint and ESLint together.** A common transition setup, keeping ESLint only for plugins Oxlint lacks. Not chosen because the only such plugin, StyleX, runs inside Oxlint as a JavaScript plugin.
- **Keep Prettier.** Stable, and the reference for formatting output. Not chosen because oxfmt matches its output for the languages here, removes a second toolchain, and adds import sorting without plugins. Prettier stays the fallback if oxfmt's beta causes churn.
- **Biome for both linting and formatting.** One tool for both jobs. Not chosen because it cannot run ESLint plugins, so the StyleX and local rules would need rewriting.

## Tradeoffs and risks

- **JavaScript plugins are alpha.** The StyleX and local rules depend on them. Pin Oxlint and plugin versions exactly, and upgrade deliberately.
- **Type-aware linting follows TypeScript 7.** Compiler options removed in TypeScript 7 cannot be used. If type-aware rules misbehave, they can be switched off while the rest keeps running, and `tsc` still type-checks.
- **Selector bans become owned code.** Each one is a local rule to maintain, with tests once testing starts.
- **A file-level disable comment could still switch rules off.** The `verify` text check closes this until Oxlint offers an option.
- **Oxfmt is beta.** A release that changes output means another reformat. Pinning contains it, and Prettier can be restored from the same options.

Revisit if JavaScript plugins regress, if type-aware rules produce false positives, if oxfmt output changes between minor versions, or if Oxlint adds selector bans or a way to refuse disable comments.
