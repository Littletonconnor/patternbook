import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import type { Reporter, TestModule } from "vitest/node";

import { testCountFile } from "./testCount.mts";

export class TestCountReporter implements Reporter {
  onTestRunEnd = (testModules: readonly TestModule[]) => {
    const tests = testModules.reduce(
      (sum, module) => sum + [...module.children.allTests()].length,
      0,
    );
    mkdirSync(dirname(testCountFile), { recursive: true });
    writeFileSync(testCountFile, `${JSON.stringify({ files: testModules.length, tests })}\n`);
  };
}
