import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";

RuleTester.describe = describe;
RuleTester.it = it;

export const ruleTester = new RuleTester({
  cwd: process.cwd(),
  languageOptions: { sourceType: "module", parserOptions: { lang: "ts" } },
});
