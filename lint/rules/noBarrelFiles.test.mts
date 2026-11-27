import { noBarrelFiles } from "./noBarrelFiles.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

const message =
  "Barrel files hide where code lives and slow builds. Import from the file that defines the export instead (RFC 0002 part 4).";

ruleTester.run("no-barrel-files", noBarrelFiles, {
  valid: [
    {
      code: 'import { isArray } from "@/lib/isArray";\nexport const read = isArray([]);',
      filename: "src/hooks/useReadLessons.ts",
    },
    {
      code: 'export { lessons } from "./catalog";\nexport const count = 1;',
      filename: "src/content/count.ts",
    },
  ],
  invalid: [
    {
      code: "export const Button = 1;",
      filename: "src/ui/index.ts",
      errors: [{ message }],
    },
    {
      code: 'export { Button } from "./Button";\nexport * from "./Link";',
      filename: "src/ui/controls.ts",
      errors: [{ message }],
    },
  ],
});
