import Papa from "papaparse";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { modifierInput } from "@/lib/modifier-schema";

const booleanValue = (value: unknown) => !["false", "0", "no"].includes(String(value ?? "true").toLowerCase());
const numberValue = (value: unknown) => value === "" || value == null ? null : Number(value);

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let rows: Record<string, unknown>[];
  if (contentType.includes("text/csv")) {
    const result = Papa.parse<Record<string, unknown>>(await request.text(), { header: true, skipEmptyLines: true });
    if (result.errors.length) return NextResponse.json({ error: result.errors[0].message }, { status: 400 });
    rows = result.data;
  } else {
    const body = await request.json(); rows = Array.isArray(body) ? body : body.modifiers;
  }
  if (!Array.isArray(rows) || rows.length > 1000) return NextResponse.json({ error: "Import must contain 1–1000 modifier rows." }, { status: 400 });
  const parsed = rows.map((row) => modifierInput.safeParse({ ...row, minRoll: numberValue(row.minRoll), maxRoll: numberValue(row.maxRoll), weight: numberValue(row.weight), enabled: booleanValue(row.enabled) }));
  const invalid = parsed.findIndex((row) => !row.success);
  if (invalid >= 0) return NextResponse.json({ error: `Row ${invalid + 2}: ${parsed[invalid].error?.issues[0]?.message}` }, { status: 400 });
  await prisma.$transaction(parsed.map((result) => {
    const { rating, weight, ...data } = result.data!;
    const normalized = { ...data, weight: weight == null ? null : Math.round(weight) };
    return prisma.modifier.upsert({ where: { internalKey: data.internalKey }, create: { ...normalized, ratings: rating ? { create: { rating } } : undefined }, update: { ...normalized, ratings: rating ? { deleteMany: {}, create: { rating } } : undefined } });
  }));
  return NextResponse.json({ imported: parsed.length });
}
