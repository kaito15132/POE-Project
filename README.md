# EyeScope — Watcher's Eye Market Analyzer

A private, local-first research workspace for **observed Watcher's Eye listings**. Milestone 1 includes the normalized SQLite database, editable modifier catalog, CSV/JSON interchange, and analytical dashboard shell. It does not contain verified game data or imply that listing prices are completed sales.

## Prerequisites

- Node.js 20 or newer
- npm (the intended lockfile is `package-lock.json`; do not use another package manager)
- Network access during the one-time setup phase to `registry.npmjs.org` and, when Prisma needs an engine binary, `binaries.prisma.sh`

## Installation

Copy the local SQLite configuration and install the exact locked dependency tree. This requires a committed `package-lock.json`:

```bash
cp .env.example .env
npm ci
```

Do not repeatedly run `npm install` during normal development or agent work. Change dependencies intentionally in `package.json`, refresh the lockfile once, and commit both files together.

If the lockfile is absent, a maintainer with registry access must bootstrap it once with `npm install --package-lock-only --ignore-scripts`, review it, and commit it. The restricted agent phase must not fabricate a lockfile or retry that command after a network-policy failure.

## Database setup

Generate Prisma Client and create or synchronize the private local SQLite database:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

For migration-based setup instead of schema push, use `npm run db:deploy`. SQLite data is stored in `prisma/dev.db` and is ignored by Git.

## Development server

```bash
npm run dev
```

Open `http://localhost:3000`. The `predev` and `prebuild` checks only detect missing dependencies; they never attempt an installation or make a network request.

## Prisma commands

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Generate Prisma Client from `prisma/schema.prisma` |
| `npm run db:push` | Synchronize the local development database without a migration |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:seed` | Seed user-configurable application settings |
| `npm run db:studio` | Open Prisma Studio |
| `npm run setup` | Verify dependencies, generate Prisma Client, and initialize/update SQLite |

Prisma and `@prisma/client` are pinned to the same version in `package.json`.

## Codex environment setup

After a valid `package-lock.json` has been committed, configure this exact script in **Codex Environment Settings** so dependencies and Prisma are prepared before the agent phase:

```bash
npm ci
npm run db:generate
npm run db:push
```

This is an environment setting, not a repository bootstrap feature; no fabricated Codex configuration file is included. Once setup succeeds, the agent should use the prepared dependencies rather than retrying registry calls.

Because `.env` is intentionally Git-ignored, also add this non-secret local SQLite variable in **Codex Environment Settings** for fresh cloud tasks:

```text
Name:  DATABASE_URL
Value: file:./dev.db
```

Local developers should create `.env` from `.env.example`; no database credentials or external service are required.

## Troubleshooting dependency access

If `npm ci` reports `E403`, `ECONNREFUSED`, `ETIMEDOUT`, or `ENETUNREACH`, stop retrying during the agent phase. Confirm that the setup environment can reach:

- `registry.npmjs.org` for npm packages
- `binaries.prisma.sh` if Prisma Client generation needs an engine binary

The warning `Unknown env config "http-proxy"` is caused by the Codex environment's injected `npm_config_http_proxy` variable, not by a repository `.npmrc`. Do not remove proxy settings that the environment requires. The proxy warning is distinct from a registry `403`.

Use `npm run check:dependencies` for an offline readiness check. It reports missing packages and exits without invoking npm installation.

## Modifier import format

Import `data/watchers-eye-modifiers.csv` to verify the workflow, then remove or replace the visibly labeled placeholder row before real analysis. The CSV header is `internalKey,aura,displayText,statDescription,minRoll,maxRoll,weight,category,notes,enabled,rating`. Imports upsert by `internalKey`; existing rows not present in the file are preserved. JSON accepts either the exported `{ schemaVersion, modifiers }` envelope or a raw modifier array.

See [the architecture proposal](docs/architecture.md) for the directory structure, schema rationale, assumptions/data boundary, and Milestone 1 scope.
