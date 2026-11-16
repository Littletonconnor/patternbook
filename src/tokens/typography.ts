import * as stylex from "@stylexjs/stylex";
import { fonts } from "./tokens.stylex";

export const type = stylex.create({
  display: {
    fontFamily: fonts.sans,
    fontSize: 40,
    lineHeight: "44px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },
  title: {
    fontFamily: fonts.sans,
    fontSize: 28,
    lineHeight: "34px",
    fontWeight: 600,
    letterSpacing: "-0.015em",
  },
  heading: {
    fontFamily: fonts.sans,
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: "26px",
    fontWeight: 400,
  },
  small: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 400,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  control: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
  },
  code: {
    fontFamily: fonts.mono,
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 400,
  },
  readout: {
    fontFamily: fonts.mono,
    fontSize: 28,
    lineHeight: "32px",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums",
  },
});
