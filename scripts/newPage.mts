import {
  createFile,
  expect,
  finish,
  fromTemplate,
  kebabName,
  pascalFromKebab,
  readArgs,
  run,
  titleFromKebab,
} from "./scaffold.mts";

run(() => {
  const [route = ""] = readArgs("npm run new:page -- route/path", 1);
  const segments = route.split("/");
  expect(
    segments.every((segment) => kebabName.test(segment)),
    `${route} must be kebab-case segments separated by /, such as changelog or guides/setup.`,
  );
  const last = segments.at(-1) ?? route;
  const file = `src/app/${route}/page.tsx`;
  createFile(
    file,
    fromTemplate("app/page.tsx", [
      ["TemplatePage", `${pascalFromKebab(last)}Page`],
      ["Page title", titleFromKebab(last)],
    ]),
  );
  finish([file], []);
});
