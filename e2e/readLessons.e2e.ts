import { expect, test } from "@playwright/test";

test("starting to read opens the first lesson", async ({ page }) => {
  await page.goto("/lessons");

  await expect(page).toHaveURL("/lessons/what-happens-when-you-type-a-url");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What happens when you type a URL",
  );
});

test("next and previous move through lessons in catalog order", async ({ page }) => {
  await page.goto("/lessons/what-happens-when-you-type-a-url");
  const pager = page.getByRole("navigation", { name: "Lessons" });

  await pager.getByRole("link", { name: /Next/ }).click();

  await expect(page).toHaveURL("/lessons/dns");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("DNS");

  await pager.getByRole("link", { name: /Previous/ }).click();

  await expect(page).toHaveURL("/lessons/what-happens-when-you-type-a-url");
});

test("an unknown lesson shows the not found page and tells search engines not to index it", async ({
  page,
}) => {
  await page.goto("/lessons/not-a-lesson");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
});
