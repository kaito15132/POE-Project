import Papa from "papaparse";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const modifiers = await prisma.modifier.findMany({ include: { ratings: true }, orderBy: { internalKey: "asc" } });
  const rows = modifiers.map((modifier) => ({
    internalKey: modifier.internalKey,
    aura: modifier.aura,
    displayText: modifier.displayText,
    statDescription: modifier.statDescription,
    minRoll: modifier.minRoll,
    maxRoll: modifier.maxRoll,
    weight: modifier.weight,
    category: modifier.category,
    notes: modifier.notes,
    enabled: modifier.enabled,
    rating: modifier.ratings[0]?.rating ?? "",
  }));
  const json = new URL(request.url).searchParams.get("format") === "json";
  return new Response(json ? JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), modifiers: rows }, null, 2) : Papa.unparse(rows), { headers: { "Content-Type": json ? "application/json" : "text/csv", "Content-Disposition": `attachment; filename="watchers-eye-modifiers.${json ? "json" : "csv"}"` } });
}
