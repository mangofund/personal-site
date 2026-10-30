# Stageflow Alpha

The browser application lives at `/live/`, isolated from VitePress styling. The Chinese and English project pages link to it. English is the default; Chinese is available in the toolbar.

## What works

- Local sandbox and D1-backed cloud rooms, 2–8 creators, group scoring and duo PK.
- Server-authoritative commands, demo gift mapping, viewer teams, countdown, manual correction and undo.
- Independent control and display capability links. Display credentials cannot write, rotate credentials or read private event/undo records.
- Server optimistic concurrency and command request IDs prevent lost updates and repeated requests from counting twice.
- Cross-device / OBS / LIVE Studio browser-source display, polling every 2 seconds. A control page does not have to remain open for an existing display to read the last state.
- CSV activity export (latest 300 events), 50 undo snapshots. Completed rounds are read-only.

## Current boundaries

- **All gifts are simulated. No TikTok provider is configured.** No live-connect button or fake connected state is shown. The provider's actual availability, regional behavior and streak events must be tested before making production claims.
- There are no accounts, paid plans or recovery email. The control link is the credential: whoever has it controls the room. Alpha rooms expire after 7 days and cannot be recovered if that link is lost. Do not use sensitive information in creator or viewer names.
- Creation is capped at 5 rooms per daily-hashed address. Reads and commands do not yet have a full product-level rate-limiting / quota system; this preview is for limited testing, not unrestricted commercial rollout.
- Activity is scoring history, not a financial settlement record. The public display contains no audit history. A revoked display link stops receiving new updates after its next poll.
- The GitHub Pages mirror supports the local sandbox only; Pages Functions require Cloudflare Pages.

## Development (Node.js 22+)

```sh
npm ci
npm run docs:build
npm run live:types
npm run live:test
npx wrangler d1 migrations apply stageflow-preview --config wrangler.stageflow.jsonc --local
npm run live:dev
# In another terminal, with the local server running:
npm run live:test:api
```

`wrangler.stageflow.jsonc` is deliberately not the root auto-discovered configuration. It describes only the Stageflow preview database; it must not replace the production site's dashboard variables or `STATS_KV` binding. Generated runtime types and local secrets/state are ignored.

## Preview deployment

The repository convention requires a preview before merging to main. On `feat/stageflow-live`, after building and pushing the tested source:

```sh
npx wrangler d1 migrations apply stageflow-preview --config wrangler.stageflow.jsonc --remote
node scripts/stageflow-preview.mjs
```

The preview script creates a temporary ignored `wrangler.jsonc` because Pages does not support a custom configuration path for deployment, deploys **only this branch** to the existing `mangofund` project, and removes that temporary file. It never deploys `main`. Production website variables are not written to source control.

Before production merge: create a separate production D1 database, apply the same migration, add its `STAGEFLOW_DB` binding to the production Pages environment while retaining all current variables and bindings, and obtain the owner's approval of the preview. Do not bind production to the preview database.

## Next integration step

Obtain an appropriate TikTok LIVE data-provider account and verify its application usage terms. Keep credentials server-side. Add an authenticated upstream consumer that handles message IDs and gift-streak deltas before issuing authoritative scoring updates. A persistent consumer (for example a separate Durable Object service bound to Pages) is needed if scoring must continue after the control browser closes. Do not trust gift values or TikTok messages submitted by a browser as authoritative live events.
