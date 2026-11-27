import { join } from "node:path";

import { unpluginFactory } from "@stylexjs/unplugin";
import { playwright } from "@vitest/browser-playwright";
import { createVitePlugin } from "unplugin";
import { configDefaults, defineConfig } from "vitest/config";

import { TestCountReporter } from "./scripts/testCountReporter.mts";

const stylex = createVitePlugin(unpluginFactory);

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    sequence: { shuffle: true },
    retry: 0,
    allowOnly: false,
    restoreMocks: true,
    unstubGlobals: true,
    reporters: [...configDefaults.reporters, new TestCountReporter()],
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts", "scripts/**/*.test.mts", "lint/**/*.test.mts"],
          exclude: ["scripts/templates/**"],
        },
      },
      {
        extends: true,
        plugins: [
          stylex({
            dev: true,
            runtimeInjection: true,
            aliases: { "@/*": [join(import.meta.dirname, "src", "*")] },
            unstable_moduleResolution: { type: "commonJS" },
          }),
        ],
        optimizeDeps: {
          include: [
            "react",
            "react-dom",
            "react-dom/client",
            "react/jsx-dev-runtime",
            "vitest-browser-react",
            "next/navigation",
            "next/link",
            "lucide-react",
            "@base-ui/react/**",
            "@stylexjs/stylex",
            "@stylexjs/stylex/lib/stylex-inject",
          ],
        },
        define: { "process.env": JSON.stringify({ NODE_ENV: "test" }) },
        test: {
          name: "browser",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["src/testing/browserSetup.ts"],
          browser: {
            enabled: true,
            provider: playwright({
              contextOptions: { permissions: ["clipboard-read", "clipboard-write"] },
            }),
            headless: true,
            viewport: { width: 1280, height: 800 },
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
