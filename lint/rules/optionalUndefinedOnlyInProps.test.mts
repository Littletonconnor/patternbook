import { optionalUndefinedOnlyInProps } from "./optionalUndefinedOnlyInProps.mts";
import { ruleTester } from "./ruleTester.fixture.mts";

const message =
  "`key?: T | undefined` lets callers set the key to undefined, and a spread such as `{ ...defaults, ...value }` then overwrites the default with undefined. Write `key?: T` and leave the key out when there is no value. Only component props, in a type named `<Name>Props`, may allow undefined, because props are read with defaults and truthiness checks that treat undefined as missing.";

ruleTester.run("optional-undefined-only-in-props", optionalUndefinedOnlyInProps, {
  valid: [
    "type LessonFields = { starter?: boolean; status: string | undefined };",
    "type PagerProps = { previous?: Lesson | undefined; next?: Lesson | undefined };",
    "type SidebarProps = { topic: { open?: boolean | undefined } };",
  ],
  invalid: [
    {
      code: "type LessonFields = { starter?: boolean | undefined };",
      errors: [{ message }],
    },
    {
      code: "type Options = { label?: undefined };\ninterface Settings { theme?: string | null | undefined }",
      errors: [{ message }, { message }],
    },
  ],
});
