import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { CodeTabs } from "./CodeTabs";

const tabs = [
  {
    label: "Offset",
    code: "SELECT * FROM posts LIMIT 20 OFFSET 40;",
    body: <pre>offset body</pre>,
  },
  {
    label: "Cursor",
    code: "SELECT * FROM posts WHERE id < $1 LIMIT 20;",
    body: <pre>cursor body</pre>,
  },
];

async function pastedText() {
  const pasteTarget = page.getByRole("textbox", { name: "Paste here" });
  await pasteTarget.click();
  await userEvent.keyboard("{ControlOrMeta>}v{/ControlOrMeta}");
  return pasteTarget;
}

test("shows the first tab, and another tab's code when it is chosen", async () => {
  await render(<CodeTabs tabs={tabs} />);

  await expect.element(page.getByText("offset body")).toBeVisible();

  await page.getByRole("tab", { name: "Cursor" }).click();

  await expect.element(page.getByText("cursor body")).toBeVisible();
  await expect.element(page.getByText("offset body")).not.toBeInTheDocument();
});

test("copies the code of the tab that is showing", async () => {
  await render(
    <>
      <CodeTabs tabs={tabs} />
      <textarea aria-label="Paste here" />
    </>,
  );

  await page.getByRole("tab", { name: "Cursor" }).click();
  await page.getByRole("button", { name: "Copy code" }).click();

  await expect.element(page.getByRole("button", { name: "Copied" })).toBeVisible();
  await expect
    .element(await pastedText())
    .toHaveValue("SELECT * FROM posts WHERE id < $1 LIMIT 20;");
});
