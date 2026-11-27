import { beforeEach } from "vitest";
import { page } from "vitest/browser";

const root = document.documentElement;

beforeEach(async () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim() ?? "";
    document.cookie = `${name}=; max-age=0; path=/`;
  }
  delete root.dataset.sidebar;
  root.removeAttribute("style");
  window.scrollTo(0, 0);
  await page.viewport(1280, 800);
});
