# Detection Types Explorer (Next.js)

Internal, read-only knowledge tool for the product & dev teams. Documents every detection
type in the system — fields (with real C# types), inheritance, and an example payload per
type — plus a **Codebase Differences** page comparing `Main-Next` ↔ `Main-Global`.

This is the **Next.js** build, packaged for **AWS Amplify** static hosting. It supersedes the
plain static `detection-explorer/` project. It is documentation only — it does **not** send
or create detections.

## Tech

- Next.js 14 (App Router) with **static export** (`output: 'export'`) → emits a static `out/`.
- All content is one file: `lib/data.ts`. Edit there to add/correct types; the UI re-renders.
- Tailwind + Lucide are loaded via CDN in `app/layout.tsx` (no CSS build step). See
  *Switching to compiled Tailwind* below if you'd rather not use the CDN.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

Build the static site locally:

```bash
npm run build    # outputs ./out
npx serve out    # optional: preview the exported static site
```

## Deploy to AWS Amplify

**Option A — Amplify Console (Git-based, recommended)**

1. Push this folder to a Git repo (GitHub / CodeCommit / Bitbucket / GitLab).
2. Amplify Console → **New app → Host web app** → connect the repo/branch.
3. Amplify auto-detects Next.js. The included **`amplify.yml`** builds and publishes the
   static export (`baseDirectory: out`). No env vars or backend needed.
4. Deploy. Every push to the branch redeploys automatically.

> If the console offers a hosting type, choose **static** (this app has no SSR/server code —
> `output: 'export'` produces a pure static bundle). The `amplify.yml` artifact dir is `out`.

**Option B — Manual / drag-and-drop**

```bash
npm install && npm run build
```

Then in Amplify Console choose **Deploy without Git** and upload the generated **`out/`**
folder (or zip it).

## amplify.yml (included)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands: [ npm ci || npm install ]
    build:
      commands: [ npm run build ]
  artifacts:
    baseDirectory: out
    files: [ '**/*' ]
  cache:
    paths: [ node_modules/**/* ]
```

## Editing the content

`lib/data.ts` holds the whole catalog (typed detections, generic registry, base fields,
and the branch-diff data). It carries `// @ts-nocheck` because it's pure data. Change a value,
commit, and Amplify redeploys.

## Switching to compiled Tailwind (optional)

The CDN keeps the project build-step-free and is fine for an internal tool. To compile
Tailwind at build time instead: `npm i -D tailwindcss postcss autoprefixer`, run
`npx tailwindcss init -p`, set `content: ['./app/**/*.{ts,tsx}']`, add the `@tailwind`
directives to `app/globals.css`, and remove the `cdn.tailwindcss.com` script from
`app/layout.tsx`. All class names in this project are written as full literal strings, so
Tailwind's content scanner will pick them up.
