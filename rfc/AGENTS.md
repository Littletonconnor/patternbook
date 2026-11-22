# RFCs

An RFC is how a large decision gets made in this repo: research the question, write a proposal grounded in that research, and get the maintainer's agreement. No code is written for an RFC until it is agreed.

## When to write one

- A new dependency, tool, or service.
- A new top-level folder, or a change to the placement rules.
- A new lint rule group, hook, or change to `verify`.
- A choice between approaches that is hard to undo or touches many files.

Not for a single component, a bug fix, copy changes, or work that follows a pattern already agreed.

## Process

1. **Write.** Copy `TEMPLATE.md` to `NNNN-short-slug.md`. RFC 0001 is the overview, and 0002 to 0007 are the layers of its priority pyramid in order: architecture, types, lint, tests, runtime verification, prose. Each layer's RFC is named after its layer. Any other RFC takes the next free number from 0008. Research first, then write the proposal. The change adds the RFC and its assets, nothing else.
2. **Review.** Answer questions by editing the RFC, so the document stays the single record. Do not leave open questions: where there is a choice, recommend an option and give the evidence.
3. **Decide.** The maintainer decides. Once agreed, update the RFC to match the decision, then turn it into `TODO.md` items that link back to it. The link runs one way: an RFC never points to `TODO.md`, because the RFC is the lasting record and the task list changes.

To change a decision later, write a new RFC and link the two.

## Research bar

- At least five sources, spanning at least three kinds: peer-reviewed or preprint research, engineering reports from teams doing the work, and official documentation or specifications. No single person, company, or tool may carry the argument alone.
- Prefer primary sources: the paper, the official docs, the original report. A write-up of someone else's work is secondary and is labelled so.
- Include the strongest counter-evidence or alternative, and answer it.
- Check every number against its source. Say when figures are self-reported, when sources disagree, and which sources could not be read.
- Read the repository as it is today. Repository facts are counts and paths, used as evidence of scale.

## Voice and tone

The register is a technical design document, not a conversation.

- **Start with the why.** The Summary and Problem explain the objective and why the current state falls short before naming any tool or design. Never open with a tool, a preset, or another team's setup; external examples are evidence and belong in the sources.
- **Record the decision, not the work behind it.** No scratch runs, prototypes, experiments, session notes, or "we tried". State facts and cite sources. Repository facts are stated as they are today.
- **Explain every concept the argument depends on.** If a reader needs to know what a term means to follow the reasoning (a lint category, a preset, a backend), define it where it first appears.
- **Lead with practices, not people.** State the best practice and the evidence for it. Names of authors, people, and companies appear only in the Research section's source table. In the body, cite with numbered links such as `[[4]](#sources)`.
- **Group the problem by practice.** Each problem names a practice, explains with evidence why it causes harm, and says what changes. Repository specifics support the argument; they are never the argument.
- **No personal framing.** Never write what someone wants, said, or prefers. Write what the evidence shows and what the design does.
- **Order by priority.** When a proposal has several parts, order them by impact or by how deterministic they are, and say why that order holds.
- **Make goals measurable.** Each goal states an outcome and how it is checked.
- **Keep evidence and recommendation apart.** "Studies found..." is evidence; "This RFC proposes..." is the decision.
- **Give alternatives their best case** before saying why they lose.
- **Plain, precise language.** Full sentences, short paragraphs, terms defined on first use. No hype words (powerful, seamless, robust, leverage), no arrow chains, no fragments.
- **Diagrams where structure matters.** Hand-drawn style SVGs in `rfc/assets/`, named `NNNN-name.svg`, with alt text that states the content.
- **Small code snippets only**, to show a shape. Aim for under about 400 lines; longer usually means two RFCs.
