"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, Copy } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { colors, radius, space } from "@/tokens/tokens.stylex";
import { IconButton } from "@/ui/IconButton";
import { Tab, Tabs, TabsList, TabsPanel } from "@/ui/Tabs";

const styles = stylex.create({
  box: {
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.line,
    borderRadius: radius.control,
  },
  header: {
    display: "flex",
    alignItems: "flex-end",
    gap: space.s3,
    paddingTop: space.s2,
    paddingInline: space.s3,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  tabs: { flexGrow: 1, marginBottom: -1 },
  copy: { paddingBottom: space.s1 },
});

type CodeTab = { label: string; code: string; body: ReactNode };

export function CodeTabs({ tabs }: { tabs: readonly CodeTab[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(tabs[active]?.code ?? "");
      setCopied(true);
    } catch {
      // clipboard blocked: leave the icon as it is
    }
  }

  return (
    <div {...stylex.props(styles.box)}>
      <Tabs value={active} onValueChange={(value) => setActive(Number(value))}>
        <div {...stylex.props(styles.header)}>
          <div {...stylex.props(styles.tabs)}>
            <TabsList>
              {tabs.map((tab, i) => (
                <Tab key={tab.label} value={i}>
                  {tab.label}
                </Tab>
              ))}
            </TabsList>
          </div>
          <span {...stylex.props(styles.copy)}>
            <IconButton
              icon={copied ? Check : Copy}
              label={copied ? "Copied" : "Copy code"}
              variant="ghost"
              size="small"
              onClick={copy}
            />
          </span>
        </div>
        {tabs.map((tab, i) => (
          <TabsPanel key={tab.label} value={i}>
            {tab.body}
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  );
}
