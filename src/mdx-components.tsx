import type { MDXComponents } from "mdx/types";
import { isValidElement } from "react";
import type { ComponentProps, ReactNode } from "react";
import { bundledLanguages } from "shiki";
import type { BundledLanguage } from "shiki";

import { Callout } from "@/components/lesson/Callout";
import { CodeBlock } from "@/components/lesson/CodeBlock";
import { Block, Breakout, Code, H2, H3, Item, List, P, Strong } from "@/components/lesson/Prose";
import { Table } from "@/components/lesson/Table";
import { Term } from "@/components/lesson/Term";
import { lessonSlugFromPath } from "@/content/catalog";
import { lessonHref } from "@/content/types";
import { headingId } from "@/lib/headingId";
import { isArray } from "@/lib/isArray";
import { Link } from "@/ui/Link";

function textOf(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (isArray(node)) {
    return node.map(textOf).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

function isLanguage(lang: string): lang is BundledLanguage {
  return lang in bundledLanguages;
}

function unsupported(element: string, instead: string) {
  return function Unsupported(): never {
    throw new Error(`MDX: ${element} is not supported in lessons. ${instead}`);
  };
}

function isExternalHref(href: string): href is `https://${string}` | `http://${string}` {
  return /^https?:\/\//.test(href);
}

function isHashHref(href: string): href is `#${string}` {
  return href.startsWith("#") && href.length > 1;
}

function MdxLink({ href = "", children }: ComponentProps<"a">) {
  if (isExternalHref(href)) {
    return (
      <Link variant="external" href={href}>
        {children}
      </Link>
    );
  }
  if (isHashHref(href)) {
    return <Link href={href}>{children}</Link>;
  }
  const slug = lessonSlugFromPath(href);
  if (slug === undefined) {
    throw new Error(
      `MDX: the link ${href} does not point at a lesson. Link to /lessons/<slug>, a #heading or an https:// URL.`,
    );
  }
  return <Link href={lessonHref({ slug })}>{children}</Link>;
}

function Fence({ children }: { children?: ReactNode }) {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    throw new Error("MDX: a code fence must contain only code.");
  }
  const lang = /language-(\S+)/.exec(children.props.className ?? "")?.[1] ?? "";
  if (!isLanguage(lang)) {
    throw new Error(`MDX: code fences need a Shiki language, for example \`\`\`ts. Got "${lang}".`);
  }
  return (
    <Block>
      <CodeBlock samples={[{ label: lang, lang, code: textOf(children.props.children) }]} />
    </Block>
  );
}

const components = {
  h1: unsupported("# (h1)", "The lesson title comes from the catalog. Start sections at ##."),
  h2: ({ children }: { children?: ReactNode }) => (
    <H2 id={headingId(textOf(children))}>{children}</H2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <H3 id={headingId(textOf(children))}>{children}</H3>
  ),
  h4: unsupported("#### (h4)", "Use ## or ### only."),
  h5: unsupported("##### (h5)", "Use ## or ### only."),
  h6: unsupported("###### (h6)", "Use ## or ### only."),
  p: ({ children }) => <P>{children}</P>,
  ul: ({ children }) => <List>{children}</List>,
  ol: ({ children }) => <List ordered>{children}</List>,
  li: ({ children }) => <Item>{children}</Item>,
  strong: ({ children }) => <Strong>{children}</Strong>,
  code: ({ children }) => <Code>{children}</Code>,
  pre: Fence,
  a: MdxLink,
  blockquote: unsupported("> (blockquote)", "Use <Callout> for an aside."),
  hr: unsupported("--- (hr)", "Use a ## heading to start a new section."),
  img: unsupported("![](image)", "Use a diagram component."),
  Callout: (props: ComponentProps<typeof Callout>) => (
    <Block>
      <Callout {...props} />
    </Block>
  ),
  CodeBlock: (props: ComponentProps<typeof CodeBlock>) => (
    <Block>
      <CodeBlock {...props} />
    </Block>
  ),
  Table: (props: ComponentProps<typeof Table>) => (
    <Block>
      <Table {...props} />
    </Block>
  ),
  Term,
  Breakout,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
