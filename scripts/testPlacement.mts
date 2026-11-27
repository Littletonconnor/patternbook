import { basename, dirname } from "node:path";

const testFile = /\.test\.(ts|tsx|mts)$/;
const fixtureFile = /\.fixture\.\w+$/;
const e2eFile = /\.e2e\.ts$/;
const sourceExtensions = [".ts", ".tsx", ".mts"];
const testRoots = ["src/", "lint/", "scripts/"];

export function isTestOrFixture(file: string) {
  return testFile.test(file) || fixtureFile.test(file);
}

function sourceOf(test: string) {
  const stem = test.replace(testFile, "");
  return sourceExtensions.map((extension) => stem + extension);
}

function checkTest(file: string, files: ReadonlySet<string>) {
  if (!testRoots.some((root) => file.startsWith(root))) {
    return `${file}: unit, integration and component tests sit beside the file they test, in src, lint or scripts. End-to-end tests go in e2e/ as <journey>.e2e.ts (RFC 0002 part 5).`;
  }
  if (!sourceOf(file).some((source) => files.has(source))) {
    const name = basename(file).replace(testFile, "");
    return `${file}: no ${name}.ts, ${name}.tsx or ${name}.mts beside it. A test sits beside the file it tests and shares its name; move it there, or delete it if that file is gone (RFC 0002 part 5).`;
  }
  return undefined;
}

function checkE2e(file: string) {
  if (!file.startsWith("e2e/")) {
    return `${file}: end-to-end tests live in e2e/, one file per journey, because a journey crosses several routes (RFC 0002 part 5).`;
  }
  return undefined;
}

function checkFixture(file: string, testFolders: ReadonlySet<string>) {
  if (file.startsWith("src/testing/") || testFolders.has(dirname(file))) {
    return undefined;
  }
  return `${file}: a fixture sits beside the test that uses it, or in src/testing once tests in two folders need it (RFC 0002 part 5).`;
}

export function testPlacementProblems(files: readonly string[]) {
  const all = new Set(files);
  const testFolders = new Set(
    files.filter((file) => testFile.test(file)).map((file) => dirname(file)),
  );
  return files.flatMap((file) => {
    let problem: string | undefined;
    if (testFile.test(file)) {
      problem = checkTest(file, all);
    } else if (e2eFile.test(file)) {
      problem = checkE2e(file);
    } else if (fixtureFile.test(file)) {
      problem = checkFixture(file, testFolders);
    }
    return problem === undefined ? [] : [problem];
  });
}
