import type { Metadata } from "next";
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
