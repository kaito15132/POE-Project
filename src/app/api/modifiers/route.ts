import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { modifierInput } from "@/lib/modifier-schema";

export async function GET() {
  const modifiers = await prisma.modifier.findMany({ include: { ratings: true }, orderBy: [{ aura: "asc" }, { displayText: "asc" }] });
  return NextResponse.json(modifiers);
}

export async function POST(request: Request) {
  const parsed = modifierInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { rating, weight, ...data } = parsed.data;
  try {
    const modifier = await prisma.modifier.create({
      data: { ...data, weight: weight == null ? null : Math.round(weight), ratings: rating ? { create: { rating } } : undefined }, include: { ratings: true },
    });
    return NextResponse.json(modifier, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal key must be unique." }, { status: 409 });
  }
}
