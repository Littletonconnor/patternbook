import {
  addImport,
  camelFromPascal,
  createFile,
  editFile,
  expect,
  finish,
  fromTemplate,
  insertAfterLine,
  insertBefore,
  kebabName,
  pascalFromKebab,
  readArgs,
  run,
} from "./scaffold.mts";

const plugin = "lint/plugin.mts";
const config = "oxlint.config.mts";

run(() => {
  const [name = ""] = readArgs("npm run new:rule -- rule-name", 1);
  expect(kebabName.test(name), `${name} must be kebab-case, such as no-inline-styles.`);
  const rule = camelFromPascal(pascalFromKebab(name));
  const file = `lint/rules/${rule}.mts`;
  const testFile = `lint/rules/${rule}.test.mts`;
  createFile(
    file,
    fromTemplate("lint/rule.mts", [
      ["../../../lint/rules/types.mts", "./types.mts"],
      ["ruleName", rule],
    ]),
  );
  createFile(
    testFile,
    fromTemplate("lint/rule.test.mts", [
      ["../../../lint/rules/ruleTester.fixture.mts", "./ruleTester.fixture.mts"],
      ["./rule.mts", `./${rule}.mts`],
      ["ruleName", rule],
      ["rule-name", name],
    ]),
  );
  editFile(plugin, (text) =>
    insertBefore(
      addImport(text, `import { ${rule} } from "./rules/${rule}.mts";`),
      "  },\n};",
      `    "${name}": ${rule},\n`,
    ),
  );
  editFile(config, (text) =>
    insertAfterLine(text, /^ {2}"patternbook\//, `  "patternbook/${name}": "error",`),
  );
  finish([file, testFile], [plugin, config]);
});
