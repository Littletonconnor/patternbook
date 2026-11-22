import { defineConfig } from "oxlint";
import type { OxlintConfig, OxlintOverride } from "oxlint";

type Rules = NonNullable<OxlintConfig["rules"]>;

// Files whose names and default exports Next.js requires.
const nextSpecialFiles = [
  "src/app/**/page.tsx",
  "src/app/**/layout.tsx",
  "src/app/**/template.tsx",
  "src/app/**/default.tsx",
  "src/app/**/loading.tsx",
  "src/app/**/error.tsx",
  "src/app/**/global-error.tsx",
  "src/app/**/not-found.tsx",
  "src/app/**/route.ts",
  "src/app/**/opengraph-image.tsx",
  "src/app/**/twitter-image.tsx",
  "src/app/**/icon.tsx",
  "src/app/**/apple-icon.tsx",
  "src/app/**/manifest.ts",
  "src/app/**/sitemap.ts",
  "src/app/**/robots.ts",
  "src/mdx-components.tsx",
  "src/middleware.ts",
  "src/proxy.ts",
];

// Plugin entry points Oxlint loads through a default export.
const jsPluginEntries = ["lint/plugin.mts"];

// Tool config files, which their tools load through a default export.
const toolConfigFiles = ["*.config.ts", "*.config.mts", "*.config.js", "*.config.mjs"];

// Config files that must stay CommonJS, because Next.js loads them with require().
const commonJsConfigFiles = ["babel.config.js", "postcss.config.js"];

// Layers of src from RFC 0002, bottom to top, with the layers each may import.
// Imports only point down, so a lower layer can be read and changed without
// reading anything above it.
const layerNames = [
  "lib",
  "tokens",
  "content",
  "ui",
  "hooks",
  "diagrams",
  "components",
  "app",
] as const;

type Layer = (typeof layerNames)[number];

const allowedImports: Record<Layer, Layer[]> = {
  lib: [],
  tokens: [],
  content: ["lib"],
  ui: ["tokens", "lib"],
  hooks: ["content", "lib"],
  diagrams: ["tokens", "ui", "lib", "hooks"],
  components: ["lib", "tokens", "content", "ui", "hooks", "diagrams"],
  app: ["lib", "tokens", "content", "ui", "hooks", "diagrams", "components"],
};

// Imports that fail in every layer. Cross-folder imports use the @/ alias so
// the layer is visible in the path, and route code is reachable only from its
// own route through ./_parts.
const importsBannedEverywhere = [
  {
    regex: String.raw`^\.\./`,
    message: "Import from another folder with the @/ alias, so the layer it comes from is visible.",
  },
  {
    regex: "^@/app(/|$)",
    message:
      "Route code is private to its route. Import ./_parts from the route itself, or move the module to src/components/<area> when a second route needs it.",
  },
];

// Libraries wrapped by src/ui. Only the ui layer imports them, so every use
// gets the design system's styling and behaviour.
const wrappedLibraries = [
  {
    regex: "^@base-ui/",
    message: "Base UI is imported only inside src/ui. Use the wrapped control from @/ui.",
  },
  {
    regex: "^next/link$",
    message:
      "next/link is imported only inside src/ui. Use Link, ButtonLink, CardLink or RowLink from @/ui.",
  },
];

function bannedLayers(allowed: Layer[], own: Layer) {
  return layerNames.filter((name) => name !== own && !allowed.includes(name));
}

function layerImports(own: Layer): OxlintOverride {
  const allowed = allowedImports[own];
  const banned = bannedLayers(allowed, own);
  const allowedText = allowed.length > 0 ? allowed.join(", ") : "nothing else in src";
  const patterns =
    own === "ui" ? [...importsBannedEverywhere] : [...importsBannedEverywhere, ...wrappedLibraries];
  if (banned.length > 0) {
    patterns.push({
      regex: `^@/(${banned.join("|")})(/|$)`,
      message: `src/${own} may import only ${allowedText}. Move the shared code down a layer, or move this module up.`,
    });
  }
  return { files: [`src/${own}/**`], rules: { "no-restricted-imports": ["error", { patterns }] } };
}

// Definite bugs. Code the TypeScript compiler accepts but that fails or
// misbehaves at runtime. Every rule here has a single correct fix.
const definiteBugs = {
  // Writing to something that should not change.
  "no-const-assign": "error",
  "no-class-assign": "error",
  "no-func-assign": "error",
  "no-import-assign": "error",
  "no-global-assign": "error",
  "no-ex-assign": "error",
  "no-delete-var": "error",
  "no-shadow-restricted-names": "error",
  "no-redeclare": "error",
  "no-dupe-class-members": "error",

  // Duplicates where only one copy takes effect.
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-dupe-else-if": "error",
  "typescript/no-duplicate-enum-values": "error",
  "typescript/no-duplicate-type-constituents": "error",

  // Comparisons that are always true, always false, or not what was meant.
  "no-constant-condition": "error",
  "no-constant-binary-expression": "error",
  "no-cond-assign": "error",
  "no-self-compare": "error",
  "no-compare-neg-zero": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
  "no-unsafe-negation": "error",
  "oxc/bad-comparison-sequence": "error",
  "oxc/bad-char-at-comparison": "error",
  "oxc/bad-object-literal-comparison": "error",
  "oxc/const-comparisons": "error",
  "oxc/double-comparisons": "error",
  "oxc/bad-min-max-func": "error",
  "oxc/bad-bitwise-operator": "error",
  "oxc/misrefactored-assign-op": "error",
  "for-direction": "error",

  // Code that never runs, or runs when it should not.
  "no-unreachable": "error",
  "no-fallthrough": "error",
  "no-unsafe-finally": "error",
  "no-unexpected-multiline": "error",
  "no-case-declarations": "error",
  "no-useless-catch": "error",
  "no-unused-labels": "error",
  "oxc/missing-throw": "error",

  // Results that are computed and then lost.
  "array-callback-return": "error",
  "getter-return": "error",
  "no-setter-return": "error",
  "require-yield": "error",
  "oxc/uninvoked-array-callback": "error",
  "no-unused-expressions": "error",
  "no-self-assign": "error",
  "no-useless-assignment": "error",

  // Classes used incorrectly.
  "constructor-super": "error",
  "no-this-before-super": "error",
  "typescript/no-misused-new": "error",
  "typescript/no-unsafe-declaration-merging": "error",
  "typescript/unbound-method": "error",
  "typescript/no-unnecessary-parameter-property-assignment": "error",
  "no-unused-private-class-members": "error",
  "no-empty-static-block": "error",

  // Broken regular expressions and strings.
  "no-invalid-regexp": "error",
  "no-empty-character-class": "error",
  "no-control-regex": "error",
  "no-misleading-character-class": "error",
  "no-useless-backreference": "error",
  "no-regex-spaces": "error",
  "no-useless-escape": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-irregular-whitespace": "error",
  "oxc/bad-replace-all-arg": "error",

  // Numbers that are not what they look like.
  "no-loss-of-precision": "error",
  "oxc/approx-constant": "error",
  "oxc/number-arg-out-of-range": "error",
  "typescript/no-unsafe-unary-minus": "error",

  // Built-ins used the wrong way.
  "no-obj-calls": "error",
  "no-new-native-nonconstructor": "error",
  "no-new-wrappers": "error",
  "typescript/no-wrapper-object-types": "error",
  "no-array-constructor": "error",
  "no-sparse-arrays": "error",
  "no-prototype-builtins": "error",
  "prefer-object-has-own": "error",
  "typescript/no-array-delete": "error",
  "typescript/no-for-in-array": "error",
  "typescript/require-array-sort-compare": "error",
  "typescript/no-misused-spread": "error",
  "oxc/no-accumulating-spread": "error",
  "no-unsafe-optional-chaining": "error",
  "no-extra-boolean-cast": "error",
  "no-extra-bind": "error",
  "no-empty-pattern": "error",
  "no-useless-rename": "error",

  // Legacy and unsafe language features.
  "no-var": "error",
  "no-with": "error",
  "typescript/no-implied-eval": "error",
  "no-debugger": "error",
  "no-undef": "error",
  "typescript/no-require-imports": "error",
  "typescript/triple-slash-reference": "error",
  "typescript/no-unsafe-function-type": "error",
  "typescript/no-empty-object-type": "error",
  "typescript/no-unnecessary-type-constraint": "error",
  "typescript/prefer-as-const": "error",

  // Broken module graphs.
  "import/no-self-import": "error",
  "import/export": "error",
} satisfies Rules;

// Type safety. Keeps `any`, unchecked assertions and compiler suppressions
// out of the code, so the types describe what actually happens at runtime.
// Data from JSON.parse, fetch and URL params must be narrowed from `unknown`.
const typeSafety = {
  "typescript/no-unsafe-argument": "error",
  "typescript/no-unsafe-assignment": "error",
  "typescript/no-unsafe-call": "error",
  "typescript/no-unsafe-member-access": "error",
  "typescript/no-unsafe-return": "error",
  "typescript/no-explicit-any": "error",
  // `as` is banned except `as const`. Narrow with a type guard instead.
  "typescript/consistent-type-assertions": ["error", { assertionStyle: "never" }],
  "typescript/no-unsafe-type-assertion": "error",
  "typescript/no-unnecessary-type-assertion": "error",
  "typescript/no-non-null-assertion": "error",
  "typescript/no-confusing-non-null-assertion": "error",
  "typescript/no-extra-non-null-assertion": "error",
  "typescript/no-non-null-asserted-nullish-coalescing": "error",
  "typescript/no-non-null-asserted-optional-chain": "error",
  // Bans ts-expect-error as well as ts-ignore and ts-nocheck. ts-check stays allowed.
  "typescript/ban-ts-comment": [
    "error",
    {
      "ts-expect-error": true,
      "ts-ignore": true,
      "ts-nocheck": true,
      "ts-check": false,
    },
  ],
  "typescript/switch-exhaustiveness-check": "error",
  // One way to declare object and array types: `type` and `T[]`.
  "typescript/consistent-type-definitions": ["error", "type"],
  "typescript/array-type": ["error", { default: "array" }],
} satisfies Rules;

// Promises and errors. Rejections that disappear, errors thrown as strings,
// and failures swallowed by empty blocks.
const promisesAndErrors = {
  "typescript/no-floating-promises": "error",
  // `attributes: false` allows async event handlers in JSX, which React supports.
  "typescript/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }],
  "typescript/await-thenable": "error",
  // Requires `await` only where it changes behaviour: returning inside try/catch.
  "typescript/return-await": ["error", "error-handling-correctness-only"],
  "typescript/only-throw-error": "error",
  "no-throw-literal": "error",
  "typescript/prefer-promise-reject-errors": "error",
  "preserve-caught-error": "error",
  "typescript/use-unknown-in-catch-callback-variable": "error",
  "no-async-promise-executor": "error",
  "no-promise-executor-return": "error",
  "promise/no-multiple-resolved": "error",
  "promise/no-return-in-finally": "error",
  "no-empty": "error",
} satisfies Rules;

// Modules and imports. Type-only imports marked with `import type`, named
// imports and exports only, and file names that match what the file exports.
// Next.js special files get an override below.
const modulesAndImports = {
  "typescript/consistent-type-imports": "error",
  "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
  "typescript/no-import-type-side-effects": "error",
  // StyleX documents `import * as stylex` as its only form.
  "import/no-namespace": ["error", { ignore: ["@stylexjs/stylex"] }],
  "import/no-default-export": "error",
  "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
} satisfies Rules;

// React. Hooks, the React Compiler's rules, JSX mistakes and legacy APIs.
const react = {
  // Hooks and the React Compiler: components the compiler cannot optimise safely.
  "react/rules-of-hooks": "error",
  "react/exhaustive-deps": "error",
  "react/set-state-in-effect": "error",
  "react/set-state-in-render": "error",
  "react/purity": "error",
  "react/refs": "error",
  "react/immutability": "error",
  "react/static-components": "error",
  "react/preserve-manual-memoization": "error",
  "react/use-memo": "error",
  "react/incompatible-library": "error",
  "react/unsupported-syntax": "error",
  "react/globals": "error",
  "react/error-boundaries": "error",

  // JSX mistakes.
  "react/jsx-key": "error",
  "react/jsx-no-duplicate-props": "error",
  "react/jsx-no-undef": "error",
  "react/jsx-no-comment-textnodes": "error",
  "react/no-unescaped-entities": "error",
  "react/no-unknown-property": "error",
  "react/no-children-prop": "error",
  "react/no-danger-with-children": "error",
  "react/void-dom-elements-no-children": "error",
  "react/jsx-props-no-spread-multi": "error",
  "react/button-has-type": "error",
  "react/checked-requires-onchange-or-readonly": "error",
  "react/display-name": "error",

  // Security.
  "react/jsx-no-script-url": "error",
  "react/jsx-no-target-blank": "error",

  // Legacy class-component APIs that are removed or deprecated.
  "react/no-direct-mutation-state": "error",
  "react/no-find-dom-node": "error",
  "react/no-is-mounted": "error",
  "react/no-render-return-value": "error",
  "react/no-string-refs": "error",
  "react/require-render-return": "error",
} satisfies Rules;

// One way to write each thing. Where the language offers several forms of the
// same operation, the form that hides bugs or reads worse is banned, so agents
// copy one pattern and reviewers read one pattern.
const oneWayToWriteEachThing = {
  // Forms that hide bugs.
  curly: "error",
  eqeqeq: ["error", "always"],
  "unicorn/no-array-fill-with-reference-type": "error",
  "unicorn/no-invalid-fetch-options": "error",
  "unicorn/no-invalid-remove-event-listener": "error",
  "unicorn/consistent-function-scoping": "error",

  // Code that should not ship.
  "no-console": "error",
  "no-eval": "error",
  "no-unused-vars": "error",

  // Variables, objects and functions.
  "prefer-const": "error",
  "object-shorthand": "error",
  "prefer-arrow-callback": "error",
  "prefer-rest-params": "error",
  "prefer-spread": "error",

  // Arrays.
  "unicorn/prefer-array-some": "error",
  "unicorn/prefer-array-index-of": "error",
  "unicorn/prefer-array-flat-map": "error",
  "unicorn/prefer-at": "error",
  "unicorn/no-magic-array-flat-depth": "error",
  "unicorn/consistent-empty-array-spread": "error",
  "unicorn/no-useless-spread": "error",
  "unicorn/prefer-set-has": "error",
  "unicorn/prefer-set-size": "error",

  // Strings and numbers.
  "unicorn/prefer-string-replace-all": "error",
  "unicorn/prefer-string-slice": "error",
  "unicorn/prefer-string-raw": "error",
  "unicorn/prefer-number-properties": "error",
  "unicorn/prefer-native-coercion-functions": "error",
  "unicorn/numeric-separators-style": "error",
  "unicorn/no-hex-escape": "error",
  "unicorn/text-encoding-identifier-case": "error",

  // Errors and async.
  "unicorn/catch-error-name": "error",
  "unicorn/prefer-optional-catch-binding": "error",
  "unicorn/no-useless-promise-resolve-reject": "error",

  // Everything else.
  "unicorn/no-typeof-undefined": "error",
  "unicorn/no-unnecessary-slice-end": "error",
  "unicorn/prefer-single-call": "error",
  "unicorn/prefer-structured-clone": "error",
  "unicorn/prefer-dom-node-append": "error",
  "unicorn/prefer-node-protocol": "error",

  // unicorn/no-instanceof-builtins: Array.isArray and typeof instead of instanceof on built-in types. unicorn/no-abusive-eslint-disable: disable comments must name a rule.
  "unicorn/no-instanceof-builtins": "error",
  "unicorn/no-abusive-eslint-disable": "error",
} satisfies Rules;

// Next.js. Native port of @next/eslint-plugin-next, all 21 rules. Catches
// framework misuse that renders fine but costs performance or correctness,
// such as <img> instead of next/image or <a> instead of Link.
const nextjs = {
  "nextjs/google-font-display": "error",
  "nextjs/google-font-preconnect": "error",
  "nextjs/inline-script-id": "error",
  "nextjs/next-script-for-ga": "error",
  "nextjs/no-assign-module-variable": "error",
  "nextjs/no-async-client-component": "error",
  "nextjs/no-before-interactive-script-outside-document": "error",
  "nextjs/no-css-tags": "error",
  "nextjs/no-document-import-in-page": "error",
  "nextjs/no-duplicate-head": "error",
  "nextjs/no-head-element": "error",
  "nextjs/no-head-import-in-document": "error",
  "nextjs/no-html-link-for-pages": "error",
  "nextjs/no-img-element": "error",
  "nextjs/no-page-custom-font": "error",
  "nextjs/no-script-component-in-head": "error",
  "nextjs/no-styled-jsx-in-document": "error",
  "nextjs/no-sync-scripts": "error",
  "nextjs/no-title-in-document-head": "error",
  "nextjs/no-typos": "error",
  "nextjs/no-unwanted-polyfillio": "error",
} satisfies Rules;

// Accessibility. Native port of eslint-plugin-jsx-a11y. Markup that screen
// readers and keyboards cannot use, which a screenshot never shows.
const accessibility = {
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-has-content": "error",
  "jsx-a11y/anchor-is-valid": "error",
  "jsx-a11y/aria-activedescendant-has-tabindex": "error",
  "jsx-a11y/aria-props": "error",
  "jsx-a11y/aria-proptypes": "error",
  "jsx-a11y/aria-role": "error",
  "jsx-a11y/aria-unsupported-elements": "error",
  "jsx-a11y/autocomplete-valid": "error",
  "jsx-a11y/click-events-have-key-events": "error",
  "jsx-a11y/heading-has-content": "error",
  "jsx-a11y/html-has-lang": "error",
  "jsx-a11y/iframe-has-title": "error",
  "jsx-a11y/img-redundant-alt": "error",
  "jsx-a11y/interactive-supports-focus": "error",
  "jsx-a11y/label-has-associated-control": "error",
  "jsx-a11y/lang": "error",
  "jsx-a11y/media-has-caption": "error",
  "jsx-a11y/mouse-events-have-key-events": "error",
  "jsx-a11y/no-access-key": "error",
  "jsx-a11y/no-aria-hidden-on-focusable": "error",
  "jsx-a11y/no-autofocus": "error",
  "jsx-a11y/no-distracting-elements": "error",
  "jsx-a11y/no-interactive-element-to-noninteractive-role": "error",
  "jsx-a11y/no-noninteractive-element-interactions": "error",
  "jsx-a11y/no-noninteractive-element-to-interactive-role": "error",
  "jsx-a11y/no-noninteractive-tabindex": "error",
  "jsx-a11y/no-redundant-roles": "error",
  "jsx-a11y/no-static-element-interactions": "error",
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/role-supports-aria-props": "error",
  "jsx-a11y/scope": "error",
  "jsx-a11y/tabindex-no-positive": "error",
} satisfies Rules;

// StyleX. Loaded from @stylexjs/eslint-plugin through jsPlugins. Styles the
// StyleX compiler cannot handle, or that behave unexpectedly.
const stylex = {
  "@stylexjs/valid-styles": "error",
  "@stylexjs/no-unused": "error",
  "@stylexjs/valid-shorthands": "error",
  "@stylexjs/sort-keys": "error",
  "@stylexjs/enforce-extension": "error",
  "@stylexjs/no-conflicting-props": "error",
  "@stylexjs/no-legacy-contextual-styles": "error",
} satisfies Rules;

// Existing rules configured for this codebase. Local rules from ./lint/plugin.mts go here too.
const repository = {
  "no-restricted-imports": [
    "error",
    { patterns: [...importsBannedEverywhere, ...wrappedLibraries] },
  ],
  "no-nested-ternary": "error",
} satisfies Rules;

export default defineConfig({
  // Native plugins: Rust ports of ESLint plugins. Turning one on enables nothing
  // by itself; each rule is still named below.
  plugins: ["typescript", "react", "nextjs", "jsx-a11y", "import", "unicorn", "promise", "oxc"],
  // ESLint-format plugins with no native port, loaded through Oxlint's JS plugin
  // support: StyleX's published plugin, and this repository's local rules.
  jsPlugins: ["@stylexjs/eslint-plugin", "./lint/plugin.mts"],
  // Categories are Oxlint's preset groups of rules. All off, so only the rules
  // named here run.
  categories: {
    correctness: "off",
    suspicious: "off",
    pedantic: "off",
    perf: "off",
    style: "off",
    restriction: "off",
    nursery: "off",
  },
  options: {
    // Runs the rules that need type information (the no-unsafe-* family,
    // floating promises and others) through oxlint-tsgolint.
    typeAware: true,
    // A disable comment that no longer suppresses anything fails the run.
    reportUnusedDisableDirectives: "error",
  },
  // Build output and files Next.js generates.
  ignorePatterns: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  rules: {
    ...definiteBugs,
    ...typeSafety,
    ...promisesAndErrors,
    ...modulesAndImports,
    ...react,
    ...oneWayToWriteEachThing,
    ...nextjs,
    ...accessibility,
    ...stylex,
    ...repository,
  },
  overrides: [
    // One override per layer: the imports each layer may not make.
    ...layerNames.map((name) => layerImports(name)),
    // The compiler already reports these on TypeScript files, and
    // no-throw-literal gives way to its type-aware version, only-throw-error.
    {
      files: ["**/*.ts", "**/*.tsx", "**/*.mts"],
      rules: {
        "no-undef": "off",
        "no-redeclare": "off",
        "no-dupe-keys": "off",
        "no-dupe-class-members": "off",
        "no-throw-literal": "off",
      },
    },
    // Next.js and tools require default exports and their own file names.
    {
      files: [...nextSpecialFiles, ...toolConfigFiles, ...jsPluginEntries],
      rules: {
        "import/no-default-export": "off",
        "unicorn/filename-case": "off",
      },
    },
    // CommonJS config files: require() is allowed, and the type-aware rules are
    // off because require() returns untyped values.
    {
      files: commonJsConfigFiles,
      env: { node: true, commonjs: true },
      rules: {
        "typescript/no-require-imports": "off",
        "typescript/no-unsafe-assignment": "off",
        "typescript/no-unsafe-call": "off",
        "typescript/no-unsafe-member-access": "off",
        "typescript/no-unsafe-argument": "off",
        "typescript/no-unsafe-return": "off",
        "unicorn/prefer-node-protocol": "off",
      },
    },
  ],
});
