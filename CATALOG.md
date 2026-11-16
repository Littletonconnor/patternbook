# Catalog

Every lesson Patternbook plans to cover, grouped by topic. Tracks are open-ended: add a lesson to any track, or start a new track for anything worth explaining.

## How it's organized

- **Tracks** group lessons by topic. They're listed roughly from beginner to advanced.
- **Inside a track**, lessons go from basic to advanced, so each one builds on the ones above it.
- **Every lesson has a level**: Foundations, Core or Advanced. You can learn from zero by reading every Foundations lesson across all tracks, then every Core lesson, then every Advanced lesson.
- **Times** are rough estimates for one focused read, including the interactive parts. Lessons marked **(first)** are the starter set we'll write first.

The engineering tracks add up to 80 lessons and about 10h 05m. That's the zero-to-hero path:

- **Foundations**: 23 lessons, 2h 57m
- **Core**: 32 lessons, 4h 05m
- **Advanced**: 25 lessons, 3h 03m

## Tracks

| #   | Track                   | Lessons | Time   |
| --- | ----------------------- | ------- | ------ |
| 1   | How the web works       | 6       | 51 min |
| 2   | The terminal and Linux  | 6       | 38 min |
| 3   | Git                     | 2       | 18 min |
| 4   | Frontend and UI         | 7       | 55 min |
| 5   | Data on the client      | 8       | 56 min |
| 6   | APIs                    | 6       | 49 min |
| 7   | Databases               | 8       | 1h 05m |
| 8   | Tricky data             | 3       | 20 min |
| 9   | Auth and security       | 9       | 1h 07m |
| 10  | Performance             | 5       | 38 min |
| 11  | Reliability and scale   | 8       | 58 min |
| 12  | Real-time               | 2       | 15 min |
| 13  | Testing                 | 2       | 15 min |
| 14  | Docker                  | 3       | 22 min |
| 15  | Shipping and operations | 5       | 38 min |
| 16  | Interactive explainers  | 3       | 26 min |

## How the web works

What happens between a URL and a page.

1. **What happens when you type a URL** · Foundations · 8 min: Every hop, from keypress to pixels.
2. **DNS** · Foundations · 7 min: The internet's phone book, and its caches.
3. **TCP, ports and TLS** · Foundations · 8 min: Why a secure connection needs a handshake before the first byte.
4. **HTTP requests and responses** · Foundations · 10 min: Methods, status codes and headers: the whole conversation in plain text.
5. **How the browser renders a page** · Foundations · 8 min: From HTML bytes to pixels, and what blocks the way.
6. **The event loop** · Foundations · 10 min: Why setTimeout(fn, 0) doesn't run right away.

## The terminal and Linux

What your terminal is actually doing.

7. **What the shell actually does** · Foundations · 7 min: From keystrokes to a running program.
8. **Processes, fork and exec** · Foundations · 7 min: How one program becomes two.
9. **File descriptors and pipes** · Foundations · 7 min: What the | in a shell command really connects.
10. **Permissions** · Foundations · 5 min: Reading rwxr-xr-x without guessing.
11. **Signals** · Foundations · 5 min: What Ctrl+C sends, and who hears it.
12. **Environment variables and config** · Foundations · 7 min: Why it works on your machine and nowhere else.

## Git

Version control without the fear.

13. **Git is a graph of snapshots** · Foundations · 10 min: Commits, branches and HEAD are just pointers.
14. **Merge, rebase and conflicts** · Foundations · 8 min: Two histories, one branch, and what to do when they disagree.

## Frontend and UI

Interfaces that work for everyone, on every screen, and feel forgiving.

15. **Responsive layout** · Foundations · 8 min: One layout that holds up from a phone to a wide monitor.
16. **Accessibility basics** · Foundations · 10 min: Semantic HTML, labels and contrast: the 80% that matters.
17. **Focus management and keyboard navigation** · Foundations · 7 min: Where focus goes when a dialog closes.
18. **Where state should live** · Foundations · 10 min: Local, lifted, global, in the URL, or on the server.
19. **Forms and validation timing** · Foundations · 8 min: When to tell someone they made a mistake.
20. **Loading, empty and error states** · Foundations · 7 min: Skeletons, spinners, and when to show nothing at all.
21. **Undo instead of confirm dialogs** · Core · 5 min: Why "Are you sure?" is usually the wrong question.

## Data on the client

Fetching, caching and showing server data without glitches.

22. **Caching and stale-while-revalidate** · Core · 8 min: Show something now, fix it in a moment.
23. **Request deduplication** · Core · 5 min: Ten components ask for the same data. Send one request.
24. **Race conditions and cancellation** · Core · 8 min: The slow response that overwrote the fast one.
25. **Debounce vs throttle** **(first)** · Core · 7 min: Two ways to ignore most of a flood of events.
26. **Search as you type** · Core · 7 min: Debounce, cancellation and caching working together.
27. **Optimistic updates and rollback** **(first)** · Core · 8 min: Pretend it worked, and recover gracefully when it didn't.
28. **Infinite scroll and virtualization** **(first)** · Advanced · 8 min: Rendering 10,000 rows without melting the browser.
29. **Prefetching** · Advanced · 5 min: Loading the next page before anyone asks for it.

## APIs

The contract between frontend and backend.

30. **REST API design** · Core · 10 min: Resources, verbs and status codes that mean what they say.
31. **Never trust the client** · Core · 7 min: Validating input at the boundary, every time.
32. **Stateless servers** · Core · 7 min: Why the server shouldn't remember you, and what that buys.
33. **Offset vs cursor pagination** **(first)** · Core · 10 min: Why page 2 sometimes shows a row you already saw.
34. **REST vs GraphQL vs RPC** · Core · 8 min: Three shapes for an API, and when each one fits.
35. **Versioning and breaking changes** · Advanced · 7 min: Changing an API without breaking the apps that use it.

## Databases

Storing data so it stays correct and fast.

36. **Tables, keys and joins** · Core · 10 min: Modelling data so each fact lives in one place.
37. **Database indexes** · Core · 10 min: Why one query takes 2 ms and its twin takes 2 seconds.
38. **N+1 queries** · Core · 7 min: The loop that quietly sends 500 queries.
39. **Transactions and isolation** · Core · 10 min: All or nothing, and what other queries see in the meantime.
40. **SQL vs NoSQL** · Core · 7 min: What you trade away when you leave relational databases.
41. **Locking and concurrent writes** · Advanced · 8 min: Two people buy the last ticket at once.
42. **Connection pooling** · Advanced · 5 min: Why your database falls over at 100 users, not 100,000.
43. **Schema migrations without downtime** · Advanced · 8 min: Renaming a column while the app is still reading it.

## Tricky data

Everyday values that are harder than they look.

44. **Dates, times and time zones** · Foundations · 8 min: Store UTC, show local, and survive daylight saving.
45. **Floating point and money** · Foundations · 5 min: Why 0.1 + 0.2 isn't 0.3, and how to count cents.
46. **Text encoding and Unicode** · Foundations · 7 min: What UTF-8 is, and why your emoji turned into ðŸ˜€.

## Auth and security

Who someone is, what they can do, and keeping attackers out.

47. **Storing passwords** · Core · 7 min: Hashing, salting, and why you never decrypt a password.
48. **Cookies vs tokens** · Core · 10 min: Where to keep a session, and what can steal it.
49. **Authentication vs authorization** · Core · 7 min: Who you are vs what you can touch, and the bug where users see each other's data.
50. **CORS** · Core · 8 min: Why the browser blocked your request, and why that's good.
51. **Cross-site scripting (XSS)** · Core · 8 min: When user input becomes code in someone else's browser.
52. **Cross-site request forgery (CSRF)** · Core · 7 min: A form on another site that submits to yours.
53. **SQL injection** · Core · 5 min: The apostrophe that dropped a table.
54. **Keeping secrets secret** · Core · 5 min: API keys out of git, out of logs and out of the browser bundle.
55. **OAuth and "Sign in with Google"** · Core · 10 min: Logging in with an account you don't own.

## Performance

Making pages load fast and stay fast.

56. **Rendering strategies** · Advanced · 10 min: Client, server, static, and what hydration costs.
57. **HTTP caching headers** · Advanced · 8 min: Cache-Control, ETags, and who's allowed to keep a copy.
58. **CDNs** · Advanced · 5 min: Serving files from a building near your users.
59. **Measuring performance** · Advanced · 8 min: Core Web Vitals, and why your laptop lies to you.
60. **Bundle size and code splitting** · Advanced · 7 min: Shipping only the JavaScript this page needs.

## Reliability and scale

Staying correct when networks fail and traffic grows.

61. **Timeouts** · Advanced · 5 min: The request that never came back, and the threads it held hostage.
62. **Retries with backoff and jitter** · Advanced · 7 min: How to retry without stampeding the server.
63. **Idempotency keys** · Advanced · 8 min: Charging a card exactly once when the request is sent twice.
64. **Rate limiting** · Advanced · 8 min: Token buckets and sliding windows, visualized.
65. **Server-side caching and invalidation** · Advanced · 8 min: Putting Redis in front of the database, and keeping it honest.
66. **Queues and background jobs** · Advanced · 8 min: Doing the slow work after you've replied.
67. **Webhooks and signatures** · Advanced · 7 min: Receiving events you can actually trust.
68. **Load balancing and horizontal scaling** · Advanced · 7 min: One server became three. Now what?

## Real-time

Keeping many clients in sync.

69. **Polling vs SSE vs WebSockets** · Advanced · 8 min: Four ways to hear about changes, compared.
70. **Conflict resolution** · Advanced · 7 min: Two edits to the same thing: last write wins, and beyond.

## Testing

Tests that catch real bugs and don't cry wolf.

71. **Testing: unit, integration and end-to-end** · Core · 10 min: What each kind catches, and how many of each to write.
72. **Mocks and flaky tests** · Core · 5 min: Tests that lie, and tests that fail on Tuesdays.

## Docker

Containers without the magic.

73. **A container is just a process** **(first)** · Core · 8 min: Namespaces and cgroups, and nothing else.
74. **Image layers and the build cache** · Core · 7 min: Why changing one line rebuilds everything after it.
75. **Container networking and volumes** · Core · 7 min: Where -p 3000:3000 sends traffic, and where your data goes when the container dies.

## Shipping and operations

Getting code to production and knowing what it's doing there.

76. **CI/CD pipelines** · Core · 7 min: Every push tested, every merge deployed.
77. **Zero-downtime deploys and rollbacks** · Advanced · 8 min: Shipping on a Friday without holding your breath.
78. **Feature flags** · Advanced · 5 min: Merging code today, turning it on next week.
79. **Logs, metrics and traces** · Advanced · 10 min: Three ways to see inside a running system.
80. **Debugging a production incident** · Advanced · 8 min: From the first alert to the postmortem.

## Interactive explainers

How the diagrams on this site are built.

81. **Building interactive SVG explainers** · Core · 10 min: The techniques behind every diagram on this site.
82. **Animating SVG paths** · Advanced · 8 min: Drawing lines that draw themselves.
83. **Scroll-driven diagrams** · Advanced · 8 min: Diagrams that advance as you read.
