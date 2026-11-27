import { browserApisInHooks } from "./browserApisInHooks.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

function message(api: string, wrapper: string) {
  return `${api} is used only inside src/hooks, so each value has one typed reader and writer and failures are handled in one place. Use ${wrapper}, or add a hook there.`;
}

ruleTester.run("browser-apis-in-hooks", browserApisInHooks, {
  valid: [
    {
      code: 'export const read = () => localStorage.getItem("patternbook:read");',
      filename: "src/hooks/useLocalStorage.ts",
    },
    {
      code: "export const write = (text: string) => navigator.clipboard.writeText(text);",
      filename: "src/hooks/useCopyToClipboard.ts",
    },
    {
      code: "beforeEach(() => window.localStorage.clear());",
      filename: "src/testing/browserSetup.ts",
    },
    {
      code: "export const language = navigator.language;",
      filename: "src/components/shell/Footer.tsx",
    },
  ],
  invalid: [
    {
      code: 'export const read = () => localStorage.getItem("patternbook:read");',
      filename: "src/components/shell/Sidebar.tsx",
      errors: [{ message: message("localStorage", "useLocalStorage") }],
    },
    {
      code: 'export const read = () => window.sessionStorage.getItem("key");',
      filename: "src/components/shell/Sidebar.tsx",
      errors: [{ message: message("sessionStorage", "a session storage hook") }],
    },
    {
      code: 'export const write = () => { document.cookie = "sidebar=closed"; };',
      filename: "src/app/lessons/[slug]/_parts/SidebarToggle.tsx",
      errors: [{ message: message("cookie", "useCookie") }],
    },
    {
      code: "export const copy = (text: string) => navigator.clipboard.writeText(text);",
      filename: "src/components/lesson/CodeBlock.tsx",
      errors: [{ message: message("clipboard", "useCopyToClipboard") }],
    },
  ],
});
