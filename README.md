# EyeScope — Watcher's Eye Market Analyzer

A private, local-first research workspace for **observed Watcher's Eye listings**. Milestone 1 includes the normalized database, editable modifier catalog, CSV/JSON interchange, and analytical dashboard shell. It does not contain verified game data or imply that listing prices are completed sales.

## Local setup

```bash
cp .env.example .env
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. Import `data/watchers-eye-modifiers.csv` to verify the workflow, then remove or replace the visibly labeled placeholder row before real analysis.

## Import format

The CSV header is `internalKey,aura,displayText,statDescription,minRoll,maxRoll,weight,category,notes,enabled,rating`. It is compatible with a normal Google Sheets CSV export. Imports upsert by `internalKey`; existing catalog rows not present in the file are preserved. JSON accepts either the exported `{ schemaVersion, modifiers }` envelope or a raw modifier array.

See [the architecture proposal](docs/architecture.md) for the directory structure, complete schema rationale, assumptions/data boundary, and smallest viable Milestone 1 definition.
