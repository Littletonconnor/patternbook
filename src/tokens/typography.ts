import * as stylex from "@stylexjs/stylex";
import { fonts } from "./tokens.stylex";

const WIDE = "@media (min-width: 768px)";

export const type = stylex.create({
  hero: {
    fontFamily: fonts.sans,
    fontSize: { [WIDE]: 56, default: 40 },
    fontWeight: 600,
    letterSpacing: "-0.03em",
    lineHeight: { [WIDE]: "58px", default: "44px" },
  },
  display: {
    fontFamily: fonts.sans,
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "44px",
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: "-0.015em",
    lineHeight: "34px",
  },
  heading: {
    fontFamily: fonts.sans,
    fontSize: 20,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    lineHeight: "28px",
  },
  lede: {
    fontFamily: fonts.sans,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: "28px",
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: "26px",
  },
  small: {
    fontFamily: fonts.sans,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "22px",
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.06em",
    lineHeight: "16px",
    textTransform: "uppercase",
  },
  labelSmall: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.06em",
    lineHeight: "16px",
    textTransform: "uppercase",
  },
  control: {
    fontFamily: fonts.sans,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
  },
  ui: {
    fontFamily: fonts.sans,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "20px",
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "16px",
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: "22px",
  },
  codeSmall: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: "20px",
  },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: 500,
    lineHeight: "16px",
  },
  number: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
    fontWeight: 400,
    lineHeight: "16px",
  },
  value: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontVariantNumeric: "tabular-nums",
    fontWeight: 500,
    lineHeight: "20px",
  },
  readout: {
    fontFamily: fonts.mono,
    fontSize: 28,
    fontVariantNumeric: "tabular-nums",
    fontWeight: 500,
    lineHeight: "32px",
  },
});
