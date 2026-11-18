import * as stylex from "@stylexjs/stylex";

const DARK = "@media (prefers-color-scheme: dark)";

export const colors = stylex.defineVars({
  // Neutrals
  paper: { default: "#FBFBF9", [DARK]: "#0F1114" },
  surface: { default: "#FFFFFF", [DARK]: "#171A1F" },
  sunken: { default: "#F4F4F1", [DARK]: "#0A0B0D" },
  line: { default: "#E4E4DF", [DARK]: "#2A2E35" },
  lineStrong: { default: "#CFCFC8", [DARK]: "#3D424B" },
  inkMuted: { default: "#6B6F76", [DARK]: "#8D929A" },
  inkSoft: { default: "#50545C", [DARK]: "#A9ADB4" },
  ink: { default: "#16181D", [DARK]: "#ECEDEA" },

  // Meaning: only used inside figures
  signal: { default: "#F0590E", [DARK]: "#FF7F45" },
  signalWash: { default: "#FFEEE3", [DARK]: "#3A1D0E" },
  signalInk: { default: "#B03C00", [DARK]: "#FFA57A" },

  focus: { default: "#2F66F0", [DARK]: "#7FA6FF" },
  focusWash: { default: "#E8EFFF", [DARK]: "#16233F" },
  focusInk: { default: "#1E4FCC", [DARK]: "#A9C3FF" },

  fault: { default: "#C4264B", [DARK]: "#FF7090" },
  faultWash: { default: "#FBE6EB", [DARK]: "#3A1620" },
  faultInk: { default: "#9E1838", [DARK]: "#FF9DB2" },

  sound: { default: "#1F8A5B", [DARK]: "#4FC790" },
  soundWash: { default: "#E3F4EB", [DARK]: "#10291D" },
  soundInk: { default: "#146943", [DARK]: "#86DDB3" },
});

export const fonts = stylex.defineVars({
  sans: "var(--font-geist-sans), system-ui, sans-serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
});

export const space = stylex.defineVars({
  s1: "4px",
  s2: "8px",
  s3: "12px",
  s4: "16px",
  s6: "24px",
  s8: "32px",
  s12: "48px",
  s16: "64px",
  s24: "96px",
});

export const radius = stylex.defineVars({
  mark: "4px",
  control: "8px",
  frame: "12px",
});

export const measure = stylex.defineVars({
  sidebar: "240px",
  prose: "720px",
  figure: "960px",
  lesson: "1120px",
  rail: "200px",
  page: "1440px",
});

export const motion = stylex.defineVars({
  press: "120ms",
  move: "280ms",
  travel: "700ms",
  stagger: "40ms",
  easeOut: "cubic-bezier(0.23, 1, 0.32, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
});
