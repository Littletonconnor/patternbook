import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  sortImports: {},

  sortPackageJson: false,
  ignorePatterns: [".next", "out", "build", "package-lock.json", "next-env.d.ts"],
});
