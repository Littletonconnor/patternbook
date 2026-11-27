import { effectsInHooks } from "./effectsInHooks.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

function message(name: string) {
  return `${name} runs only inside a custom hook, so components stay free of effects and each one has a name. Move it into a use* function, in this file if only this component needs it, or in src/hooks or src/diagrams if it is shared.`;
}

ruleTester.run("effects-in-hooks", effectsInHooks, {
  valid: [
    "export function useWindowEvent(name: string, handler: () => void) {\n  useEffect(() => {\n    window.addEventListener(name, handler);\n  }, [name, handler]);\n}",
    "export const useRoundTrip = () => {\n  const id = requestAnimationFrame(() => undefined);\n  return id;\n};",
    "export function useTimer() {\n  return () => window.setTimeout(() => undefined, 100);\n}",
  ],
  invalid: [
    {
      code: "export function Sidebar() {\n  useEffect(() => undefined, []);\n  return null;\n}",
      errors: [{ message: message("useEffect") }],
    },
    {
      code: "export const CopyButton = () => {\n  window.setTimeout(() => undefined, 1500);\n  return null;\n};",
      errors: [{ message: message("setTimeout") }],
    },
    {
      code: "setInterval(() => undefined, 1000);",
      errors: [{ message: message("setInterval") }],
    },
  ],
});
