# Apps@Bill

An interactive proof of concept for an **internal developer platform** — think of it as an internal App Store. Teams build a tool, submit it, it goes through security review and approval, and it ships to production with hosting, secrets, access provisioning, and DNS handled for them.

> **This is a POC.** Everything is driven by in-memory mock data (`src/lib/mock-data.ts`). There is no backend, no database, and no authentication. It is a UX and product-thinking artifact, not production software.
>
> Not affiliated with or endorsed by BILL (bill.com). Built as an independent concept demo.

## The idea

The single biggest reason internal tools die is that the overhead of deploying them safely exceeds the effort of building them. Apps@Bill removes that overhead so a team can go from "this workflow is painful" to "here's a working tool" without coordinating a repo, CI/CD, hosting, DNS, Okta, secret storage, and a security review across four different teams.

## Surfaces

| Route | What it shows |
|---|---|
| `/` | App catalog — browse approved internal apps, with search and filtering |
| `/new` | Multi-step submission wizard: basics → data scopes → secrets → access → review |
| `/my-apps` | Your apps, their status, and actions |
| `/apps/[id]` | App detail — owner, data scopes, provisioned secrets, access, audit info |
| `/apps/[id]/submit` | Submission flow for an existing app |
| `/review` | Reviewer queue — apps awaiting security and access review |
| `/review/[id]` | Review detail — security findings, requested scopes, approve/reject |
| `/admin/users` | Global user access management |
| `/admin/secrets` | Global secrets inventory with rotation status |

## Stack

- Next.js 16 (App Router, static export via `output: "export"`)
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react icons

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To produce a static build:

```bash
npm run build
```

The static site lands in `out/` and can be served by any static host.

## Docs

- `CONCEPT.md` — product vision, the problem, personas, and platform design
- `requirements.md` — detailed screen-by-screen requirements and flows
- `ADD_POC.md` — original notes from when this was hosted alongside other POCs

## No credentials

This repo contains no API keys, tokens, or secrets. Secret **names** appear in the mock data and docs (`GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, etc.) purely as illustrative UI content.
