import * as stylex from "@stylexjs/stylex";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { sidebarScript } from "@/hooks/sidebarScript";
import { palette } from "@/tokens/palette";
import { colors } from "@/tokens/tokens.stylex";
import { type } from "@/tokens/typography";

import "./globals.css";

const styles = stylex.create({
  body: { margin: 0, backgroundColor: colors.paper, color: colors.ink },
  root: { isolation: "isolate", minHeight: "100vh" },
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Interactive lessons on software engineering patterns, each with a diagram of the broken and fixed versions that you can change and step through.";

export const metadata: Metadata = {
  title: { default: "Patternbook", template: "%s · Patternbook" },
  description,
  applicationName: "Patternbook",
  openGraph: { type: "website", siteName: "Patternbook", locale: "en", description },
  twitter: { card: "summary_large_image" },
  appleWebApp: { title: "Patternbook", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: palette.paper },
    { media: "(prefers-color-scheme: dark)", color: palette.paperDark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: sidebarScript }} />
      </head>
      <body {...stylex.props(type.body, styles.body)}>
        <div {...stylex.props(styles.root)}>{children}</div>
      </body>
    </html>
  );
}
