import type { Metadata } from "next";

import { PageIntro } from "@/components/shell/PageIntro";
import { PageShell } from "@/components/shell/PageShell";

export const metadata: Metadata = {
  title: "Page title",
  description: "One sentence on what this page is for.",
};

export default function TemplatePage() {
  return (
    <PageShell width="narrow">
      <PageIntro eyebrow="Eyebrow" title="Page title">
        One sentence on what this page is for.
      </PageIntro>
    </PageShell>
  );
}
