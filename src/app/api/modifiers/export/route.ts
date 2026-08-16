import Papa from "papaparse";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const modifiers = await prisma.modifier.findMany({ include: { ratings: true }, orderBy: { internalKey: "asc" } });
  const rows = modifiers.map(({ id: _id, createdAt: _created, updatedAt: _updated, ratings, favorite: _favorite, modifierDemandScore: _d, auraPopularityScore: _a, metaScore: _m, metaLastUpdated: _ml, ...row }) => ({ ...row, rating: ratings[0]?.rating ?? "" }));
  const json = new URL(request.url).searchParams.get("format") === "json";
  return new Response(json ? JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), modifiers: rows }, null, 2) : Papa.unparse(rows), { headers: { "Content-Type": json ? "application/json" : "text/csv", "Content-Disposition": `attachment; filename="watchers-eye-modifiers.${json ? "json" : "csv"}"` } });
}
