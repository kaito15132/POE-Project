# Milestone 1 architecture proposal

## Scope

Milestone 1 is deliberately limited to a local Next.js shell, a normalized SQLite schema, and an editable modifier catalog with CSV/JSON import and export. Pricing, generated combinations, scoring, and game-mechanic calculations are represented by extension points or schema, but are not presented as working analysis.

## Directory structure

```text
data/                         spreadsheet-friendly example imports
docs/                         architecture and data-boundary decisions
prisma/                       portable relational schema, migrations, seed
src/app/                      Next.js pages, layouts, and route handlers
src/components/               reusable client and presentation components
src/lib/                      database client and import validation
src/services/price-data/      market provider contract and implementations
tests/                        isolated analytical unit tests (later milestones)
```

Business logic belongs in `src/services`, persistence in Prisma/repositories, transport in route handlers, and rendering/state in components. Callers should depend on `PriceDataProvider`, not a particular ingestion source. Replacing SQLite with PostgreSQL should therefore require datasource/migration work rather than UI or domain rewrites.

## Proposed data model

The complete proposal is executable in `prisma/schema.prisma`. Modifier identity is the unique `internalKey`; combinations use a unique sorted canonical key but retain normalized `CombinationModifier` rows. Rolls are observations rather than identity. Market and listing observations are append-only records scoped to a league. Subjective ratings, research status, settings, currency rates, and aura synergy are separate concerns.

String fields are used for evolving classifications (category, rating, confidence, liquidity, currency, and status) instead of database enums. Application validation supplies the constrained vocabulary, while avoiding a difficult SQLite-to-PostgreSQL enum migration.

## Assumptions and unresolved requirements

- No verified modifier catalog, roll ranges, modifier weights, aura compatibility, reroll probabilities, currency rate, active league, or demand data was provided.
- Modifier `weight` is nullable and has no mechanical interpretation in Milestone 1.
- Ratings are annotations and never feed price calculations implicitly.
- Timestamps are stored in UTC by Prisma; display-local timezone support is deferred.
- CSV import is an upsert keyed by `internalKey`. Blank optional cells become `null`; malformed rows are rejected as a batch.
- Deletion is intentionally omitted because historical foreign keys will require an explicit archival policy. `enabled` is the safe Milestone 1 alternative.
- SQLite is the local source of truth. JSON export is a catalog export, not yet a complete database backup.

## Verified data vs user assumptions

**Verified application facts:** stable internal identifiers are required; jewels can be described by normalized modifier relationships; market observations must be league-scoped and must not be described as completed sales.

**User-configurable assumptions:** all catalog records, roll boundaries, weights/probabilities, subjective ratings, demand/meta scores, aura synergy, freshness thresholds, scoring weights, liquidity labels, outlier policy, and currency conversion. The included CSV row is explicitly a placeholder and must not be treated as Path of Exile data.

## Milestone sequence

The smallest viable first milestone provides a responsive dark dashboard shell, persistent modifier CRUD, search/filtering, validation, a Google Sheets-friendly CSV template/import, and CSV/JSON export. Combination generation and favorites belong to Milestone 2; observations and statistics begin in Milestone 3. This keeps unverified mechanics out while establishing the interfaces and normalized storage those features need.
