import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import * as stylex from "@stylexjs/stylex";
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

export const metadata: Metadata = {
  title: "Patternbook",
  description: "An interactive notebook of everyday engineering problems.",
  applicationName: "Patternbook",
  appleWebApp: { title: "Patternbook", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBFBF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1114" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body {...stylex.props(type.body, styles.body)}>
        <div {...stylex.props(styles.root)}>{children}</div>
      </body>
    </html>
  );
}
