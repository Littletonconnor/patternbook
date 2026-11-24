import { defineConfig } from "oxlint";
import type { OxlintConfig, OxlintOverride } from "oxlint";

type Rules = NonNullable<OxlintConfig["rules"]>;
type ImportPattern = { regex: string; message: string };

// Next.js finds these files by name and loads their default export, so they
// are exempt from the file-name and named-export rules below.
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
  "scripts/templates/app/page.tsx",
];

// Oxlint loads plugins through a default export, so these files keep one.
const jsPluginEntries = ["lint/plugin.mts"];

// Tools load their config through a default export, so these files keep one.
const toolConfigFiles = ["*.config.ts", "*.config.mts", "*.config.js", "*.config.mjs"];

// Next.js loads these configs with require(), so they stay CommonJS and get
// the CommonJS override below.
const commonJsConfigFiles = ["babel.config.js", "postcss.config.js"];

// A lower layer should be readable and changeable without reading anything
// above it. These are the top-level folders of src from the bottom up, and the
// layers each one may import. Imports only point down.
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

// The layer an import comes from should be visible in its path, and code that
// belongs to one route should stay private to it. So relative imports that
// leave the folder, and any import of @/app, fail in every layer.
const importsBannedEverywhere: ImportPattern[] = [
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

// Every control and link should get the design system's styling and
// behaviour. These libraries are wrapped by src/ui, so only src/ui may import
// them.
const wrappedLibraries: ImportPattern[] = [
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

function layerPatterns(own: Layer, label = `src/${own}`) {
  const allowed = allowedImports[own];
  const banned = bannedLayers(allowed, own);
  const allowedText = allowed.length > 0 ? allowed.join(", ") : "nothing else in src";
  const patterns =
    own === "ui" ? [...importsBannedEverywhere] : [...importsBannedEverywhere, ...wrappedLibraries];
  if (banned.length > 0) {
    patterns.push({
      regex: `^@/(${banned.join("|")})(/|$)`,
      message: `${label} may import only ${allowedText}. Move the shared code down a layer, or move this module up.`,
    });
  }
  return patterns;
}

function importOverride(files: string[], patterns: ImportPattern[]): OxlintOverride {
  return { files, rules: { "no-restricted-imports": ["error", { patterns }] } };
}

function layerImports(own: Layer) {
  return importOverride([`src/${own}/**`], layerPatterns(own));
}

// A lesson's diagrams draw, so they need tokens, ui and hooks like the diagram
// kit does. They live in the lesson's folder under content, so that folder gets
// the diagram kit's import rules instead of content's.
const lessonDiagramImports = importOverride(
  ["src/content/lessons/*/**"],
  layerPatterns("diagrams", "A lesson's diagrams"),
);

// Generator templates should break the moment a convention changes. Scripts
// sit outside src and reach into it with relative paths, so the relative ban is
// lifted there, and each template is checked against the rules of the layer it
// is copied into.
const notRelative = (pattern: ImportPattern) => pattern !== importsBannedEverywhere[0];
const scriptImports = [
  importOverride(["scripts/**"], wrappedLibraries),
  importOverride(["scripts/templates/ui/**"], layerPatterns("ui").filter(notRelative)),
  importOverride(["scripts/templates/app/**"], layerPatterns("app").filter(notRelative)),
  importOverride(
    ["scripts/templates/lesson/**"],
    layerPatterns("diagrams", "A lesson's diagrams").filter(notRelative),
  ),
];

// The TypeScript compiler accepts some code that fails or misbehaves at
// runtime. These rules catch it. Every rule here has a single correct fix.
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

// Types are only useful if they describe what happens at runtime. These rules
// keep `any`, unchecked assertions and compiler suppressions out, so data from
// JSON.parse, fetch and URL params has to be narrowed from `unknown`.
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
  // A condition the types say is always true or always false is either dead
  // code or a type that is wrong, so both are reported.
  "typescript/no-unnecessary-condition": "error",
  // Method signatures have their parameters checked loosely even in strict
  // mode, so members are written as function properties, which are checked fully.
  "typescript/method-signature-style": ["error", "property"],
  // A response is only as safe as the parser it goes through, so each external
  // service gets one client module that parses every response, exempted here.
  "no-restricted-globals": [
    "error",
    {
      name: "fetch",
      message:
        "Call an external service through its client module, which parses every response into a typed value.",
    },
  ],
  // One way to declare object and array types: `type` and `T[]`.
  "typescript/consistent-type-definitions": ["error", "type"],
  "typescript/array-type": ["error", { default: "array" }],
} satisfies Rules;

// A failure nobody sees is the hardest kind to debug. These rules catch
// rejections that disappear, errors thrown as strings, and failures swallowed
// by empty blocks.
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

// A module should be findable from the name of what it exports. These rules
// require named imports and exports, `import type` for type-only imports, and
// file names that match the export. Next.js special files get an override below.
const modulesAndImports = {
  "typescript/consistent-type-imports": "error",
  "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
  "typescript/no-import-type-side-effects": "error",
  // StyleX documents `import * as stylex` as its only form.
  "import/no-namespace": ["error", { ignore: ["@stylexjs/stylex"] }],
  "import/no-default-export": "error",
  "unicorn/filename-case": ["error", { cases: { camelCase: true, pascalCase: true } }],
} satisfies Rules;

// React code that breaks hooks, defeats the React Compiler or uses removed
// APIs fails quietly in the browser. These rules catch it at lint time.
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

// When the language offers several ways to write the same thing, agents copy
// all of them and reviewers have to read all of them. These rules keep one
// form: the one that hides fewer bugs and reads better.
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

  // instanceof fails across realms, so built-in types are checked with
  // Array.isArray and typeof. A disable comment must name the rule it silences.
  "unicorn/no-instanceof-builtins": "error",
  "unicorn/no-abusive-eslint-disable": "error",
} satisfies Rules;

// Some framework misuse renders fine but costs performance or correctness,
// such as <img> instead of next/image. These are all 21 rules of the Next.js
// plugin, run natively.
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

// A screenshot never shows markup that screen readers and keyboards cannot
// use. These rules from the jsx-a11y plugin, run natively, catch it.
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

// Some styles compile to something unexpected, or don't compile at all. These
// rules come from StyleX's own plugin, loaded through jsPlugins.
const stylex = {
  "@stylexjs/valid-styles": "error",
  "@stylexjs/no-unused": "error",
  "@stylexjs/valid-shorthands": "error",
  "@stylexjs/sort-keys": "error",
  "@stylexjs/enforce-extension": "error",
  "@stylexjs/no-conflicting-props": "error",
  "@stylexjs/no-legacy-contextual-styles": "error",
} satisfies Rules;

// Conventions specific to this repository. The local rules from
// ./lint/plugin.mts keep barrels, catch-all names, raw icons and stray
// storage, cookie and clipboard access out. Files and functions should fit on about one screen, so the size
// limits cap lines, nesting and branching.
const repository = {
  "patternbook/no-barrel-files": "error",
  "patternbook/no-catch-all-names": "error",
  "patternbook/icons-through-icon": "error",
  "patternbook/browser-apis-in-hooks": "error",
  "patternbook/no-comments": "error",
  "patternbook/no-enum": "error",
  "patternbook/colours-from-tokens": "error",
  "patternbook/type-from-tokens": "error",
  "patternbook/effects-in-hooks": "error",
  "patternbook/optional-undefined-only-in-props": "error",
  "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: false }],
  "max-lines-per-function": ["error", { max: 60, skipBlankLines: true }],
  "react/jsx-max-depth": ["error", { max: 5 }],
  complexity: ["error", { max: 10 }],
  "max-depth": ["error", { max: 3 }],
  "max-params": ["error", { max: 3 }],
  "no-restricted-imports": [
    "error",
    { patterns: [...importsBannedEverywhere, ...wrappedLibraries] },
  ],
  "no-nested-ternary": "error",
} satisfies Rules;

export default defineConfig({
  // Each plugin's rules have to be named before they can run. These are the
  // native plugins, Rust ports of ESLint plugins. Turning one on enables nothing
  // by itself.
  plugins: ["typescript", "react", "nextjs", "jsx-a11y", "import", "unicorn", "promise", "oxc"],
  // StyleX's plugin and this repository's local rules have no native port, so
  // they run through Oxlint's support for ESLint-format plugins.
  jsPlugins: ["@stylexjs/eslint-plugin", "./lint/plugin.mts"],
  // Every rule that runs should be one we chose. Categories are Oxlint's preset
  // groups of rules, so all of them are off and only the rules named here run.
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
    // Some rules, such as the no-unsafe-* family and floating promises, need type
    // information. This runs them through oxlint-tsgolint.
    typeAware: true,
    // A stale disable comment hides the next real problem on that line, so one
    // that no longer suppresses anything fails the run.
    reportUnusedDisableDirectives: "error",
  },
  // Generated files are not ours to fix, so build output and Next.js's
  // generated types are skipped.
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
    // A catalog of every lesson is long by nature, and so is this config, so
    // these files are exempt from the line limit.
    {
      files: [
        "src/content/catalog.ts",
        "src/content/glossary.ts",
        "src/content/diagrams.ts",
        "oxlint.config.mts",
      ],
      rules: { "max-lines": "off" },
    },
    // This config is the documentation for every rule, so it is the one file
    // where comments are allowed.
    { files: ["oxlint.config.mts"], rules: { "patternbook/no-comments": "off" } },
    // The Open Graph image is rendered by next/og, which takes inline styles and
    // can't read StyleX, so it sets its type sizes directly.
    {
      files: ["src/components/shell/OgCard.tsx"],
      rules: { "patternbook/type-from-tokens": "off" },
    },
    // Each layer may only import the layers below it, so each gets an override
    // listing the imports it may not make.
    ...layerNames.map((name) => layerImports(name)),
    lessonDiagramImports,
    ...scriptImports,
    // The compiler already reports these on TypeScript files, so they are off
    // there. no-throw-literal is replaced by its type-aware version,
    // only-throw-error.
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
    // Next.js and tools find these files by name and load a default export, so
    // the naming and named-export rules are off for them.
    {
      files: [...nextSpecialFiles, ...toolConfigFiles, ...jsPluginEntries],
      rules: {
        "import/no-default-export": "off",
        "unicorn/filename-case": "off",
      },
    },
    // These configs must stay CommonJS, so require() is allowed. require()
    // returns untyped values, so the type-aware rules are off.
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
