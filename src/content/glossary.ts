export const glossary = {
  "sort-key": {
    term: "Sort key",
    definition: "The column a list is ordered by. A good one never changes.",
  },
  cursor: {
    term: "Cursor",
    definition: "A value from the last row you saw, used to ask for the rows after it.",
  },
  offset: {
    term: "Offset",
    definition: "How many rows to skip before the page starts. A position, not a value.",
  },
} satisfies Record<string, { term: string; definition: string }>;

export type GlossaryId = keyof typeof glossary;
