# System Design Learning Platform

A static documentation-style website for learning System Design, High Level Design (HLD), and Low Level Design (LLD). Built with Next.js (App Router), TypeScript, Tailwind CSS, and MDX.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **MDX** (via `next-mdx-remote/rsc`)
- **Static Site Generation** — all pages are pre-rendered at build time
- No backend or database

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### If you see `vendor-chunks` or `Cannot find module` errors

The Next.js build cache can get out of sync. Clear it and restart:

```bash
npm run clean
npm run dev
```

Or one step: `npm run dev:clean`

## Build & Export

```bash
npm run build
```

With `output: 'export'` in `next.config.js`, the build produces a static export in the `out/` directory, deployable to Vercel, Netlify, or any static host.

## Project Structure

- `app/` — Next.js App Router pages and layout
- `components/` — Navbar, Sidebar, ContentLayout, CodeBlock, DiagramBlock, Card, TableOfContents, SearchBar
- `content/` — MDX files organized by section:
  - `fundamentals/`
  - `hld/`
  - `lld/`
  - `case-studies/`
- `lib/` — Navigation config and content helpers

## Adding Content

1. Add a new `.mdx` file under the appropriate section in `content/`.
2. Register the page in `lib/navigation.ts` (add an item under the right section).
3. Rebuild; the new page will be available at `/learn/<section>/<slug>`.

## Features

- **Sidebar navigation** — Sticky left sidebar on all learning pages
- **Table of contents** — Optional right-side TOC on larger screens
- **Client-side search** — Search bar in navbar (⌘K)
- **Dark mode** — Toggle in navbar; preference stored in `localStorage`
- **Mermaid diagrams** — Use ` ```mermaid ` code blocks or `<DiagramBlock chart="..." />` in MDX
- **Code blocks** — Syntax styling and copy button via `CodeBlock` and fenced code in MDX
- **Responsive layout** — Mobile-friendly with collapsible sidebar behavior

## License

MIT
