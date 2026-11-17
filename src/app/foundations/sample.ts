import type { Topic } from "@/content/types";

export const sampleTopics: Topic[] = [
  {
    slug: "git",
    title: "Git",
    lessons: [
      {
        number: 1,
        slug: "commits-are-snapshots",
        title: "Commits are snapshots",
        hook: "A commit stores the whole tree, not a diff.",
        level: "foundations",
        minutes: 8,
        status: "published",
      },
      {
        number: 2,
        slug: "rebase-vs-merge",
        title: "Rebase vs merge",
        hook: "Two ways to join histories, and when each one lies.",
        level: "core",
        minutes: 12,
        status: "published",
      },
    ],
  },
  {
    slug: "apis",
    title: "APIs",
    lessons: [
      {
        number: 31,
        slug: "idempotency",
        title: "Idempotency keys",
        hook: "Why a retried payment shouldn't charge twice.",
        level: "core",
        minutes: 9,
        status: "published",
      },
      {
        number: 32,
        slug: "stateless-servers",
        title: "Stateless servers",
        hook: "Why the server shouldn't remember you.",
        level: "foundations",
        minutes: 7,
        status: "published",
      },
      {
        number: 33,
        slug: "offset-vs-cursor",
        title: "Offset vs cursor",
        hook: "Why page two shows a row you already saw.",
        level: "core",
        minutes: 10,
        status: "published",
      },
      {
        number: 34,
        slug: "rest-graphql-rpc",
        title: "REST vs GraphQL vs RPC",
        hook: "Three shapes for an API.",
        level: "core",
        minutes: 11,
        status: "published",
      },
      {
        number: 35,
        slug: "rate-limiting",
        title: "Rate limiting",
        hook: "Token buckets, and who gets to go first.",
        level: "advanced",
        minutes: 12,
        status: "published",
      },
      {
        number: 36,
        slug: "webhooks",
        title: "Webhooks",
        hook: "Letting the other server call you.",
        level: "core",
        minutes: 9,
        status: "planned",
      },
    ],
  },
];

export const sampleLesson = sampleTopics[1].lessons[2];
