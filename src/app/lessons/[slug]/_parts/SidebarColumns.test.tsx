import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

import { SidebarHeader } from "@/components/shell/SidebarHeader";
import { SIDEBAR_KEY } from "@/hooks/sidebarScript";
import { readLocalStorage } from "@/hooks/useLocalStorage";

import { SidebarColumns } from "./SidebarColumns";
import { SidebarToggle } from "./SidebarToggle";

function Layout() {
  return (
    <>
      <SidebarToggle />
      <SidebarColumns
        sidebar={<SidebarHeader canCollapse={false} onCollapseAll={() => {}} closable />}
      >
        <main>Lesson</main>
      </SidebarColumns>
    </>
  );
}

const hide = page.getByRole("button", { name: "Hide sidebar" });
const show = page.getByRole("button", { name: "Show sidebar" });
const shortcut = String.raw`{ControlOrMeta>}\{/ControlOrMeta}`;
const handle = page.getByRole("separator", { name: "Resize sidebar" });

function stored(): unknown {
  return readLocalStorage(SIDEBAR_KEY, (value) => value, null);
}

test("hides the sidebar, remembers it, and shows it again", async () => {
  await render(<Layout />);

  await hide.click();

  await expect.element(show).toBeVisible();
  await expect.element(handle).toHaveAttribute("aria-valuenow", "0");
  expect(document.getElementById("lesson-sidebar")?.inert).toBe(true);
  expect(stored()).toMatchObject({ collapsed: true });

  await show.click();

  await expect.element(hide).toBeVisible();
  await expect.element(show).not.toBeInTheDocument();
  expect(stored()).toMatchObject({ collapsed: false });
});

test("toggles the sidebar with Cmd or Ctrl and backslash", async () => {
  await render(<Layout />);

  await userEvent.keyboard(shortcut);
  await expect.element(show).toBeVisible();

  await userEvent.keyboard(shortcut);
  await expect.element(show).not.toBeInTheDocument();
});

test("resizes the sidebar from the keyboard within its limits", async () => {
  await render(<Layout />);
  await expect.element(handle).toHaveAttribute("aria-valuenow", "264");

  handle.element().focus();

  await userEvent.keyboard("{ArrowRight}");
  await expect.element(handle).toHaveAttribute("aria-valuenow", "280");

  await userEvent.keyboard("{End}");
  await expect.element(handle).toHaveAttribute("aria-valuenow", "420");

  await userEvent.keyboard("{Home}");
  await expect.element(handle).toHaveAttribute("aria-valuenow", "200");
  expect(stored()).toMatchObject({ width: 200, collapsed: false });
});
