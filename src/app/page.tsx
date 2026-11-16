import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  page: { padding: 64, color: "#F0590E" },
});

export default function Home() {
  return <main {...stylex.props(styles.page)}>Patternbook</main>;
}
