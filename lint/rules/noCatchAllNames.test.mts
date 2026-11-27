import { noCatchAllNames } from "./noCatchAllNames.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

const code = "export const value = 1;";

function message(segment: string) {
  return `"${segment}" says nothing about what the module does. Name the file after what it exports and put it in the layer it belongs to (RFC 0002 part 4).`;
}

ruleTester.run("no-catch-all-names", noCatchAllNames, {
  valid: [
    { code, filename: "src/lib/headingId.ts" },
    { code, filename: "src/components/shell/markShape.ts" },
    { code, filename: "src/lib/utilsLike.ts" },
  ],
  invalid: [
    { code, filename: "src/lib/utils.ts", errors: [{ message: message("utils") }] },
    { code, filename: "src/helpers/format.ts", errors: [{ message: message("helpers") }] },
    { code, filename: "src/components/shared/Card.tsx", errors: [{ message: message("shared") }] },
    { code, filename: "src/content/common.ts", errors: [{ message: message("common") }] },
  ],
});
