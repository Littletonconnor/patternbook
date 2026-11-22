import { existsSync } from "node:fs";
import {
  addImport,
  createFile,
  editFile,
  expect,
  finish,
  fromTemplate,
  insertBefore,
  pascalFromKebab,
  pascalName,
  camelFromPascal,
  run,
  kebabName,
} from "./scaffold.mts";

const usage = "npm run new:primitive -- Name [base-ui-module]";
const examples = "src/app/foundations/_parts/Primitives.tsx";

function primitiveSource(name: string, base: string | undefined) {
  const named: [string, string][] = [
    ["Primitive", name],
    ["primitive", camelFromPascal(name)],
  ];
  if (base === undefined) {
    return fromTemplate("ui/Primitive.tsx", named);
  }
  const modulePath = `node_modules/@base-ui/react/${base}`;
  expect(
    kebabName.test(base) && existsSync(modulePath),
    `${base} is not a Base UI module, such as toggle or meter.`,
  );
  const parts: [string, string][] = existsSync(`${modulePath}/index.parts.d.ts`)
    ? [
        ["typeof BasePrimitive>", "typeof BasePrimitive.Root>"],
        ["<BasePrimitive ", "<BasePrimitive.Root "],
      ]
    : [];
  return fromTemplate("ui/BasePrimitive.tsx", [
    ['"@base-ui/react/toggle"', `"@base-ui/react/${base}"`],
    ["{ Toggle as", `{ ${pascalFromKebab(base)} as`],
    ...parts,
    ...named,
  ]);
}

run(() => {
  const [name, base, extra] = process.argv.slice(2);
  expect(name !== undefined && extra === undefined, `Usage: ${usage}`);
  const component = name ?? "";
  expect(pascalName.test(component), `${component} must be PascalCase, such as NumberField.`);
  const file = `src/ui/${component}.tsx`;
  const example = `src/app/foundations/_parts/${component}.tsx`;
  createFile(file, primitiveSource(component, base));
  createFile(
    example,
    fromTemplate("app/PrimitiveExample.tsx", [
      ['"../ui/Primitive"', `"@/ui/${component}"`],
      ['"../../../src/app/foundations/_parts/', '"./'],
      ["Primitive", component],
    ]),
  );
  editFile(examples, (text) =>
    insertBefore(
      addImport(text, `import { ${component}Example } from "./${component}";`),
      "</div>",
      `<${component}Example />\n`,
    ),
  );
  finish([file, example], [examples]);
});
