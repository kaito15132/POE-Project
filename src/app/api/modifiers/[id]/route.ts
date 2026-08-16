import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { modifierInput } from "@/lib/modifier-schema";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = modifierInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  const { rating, weight, ...data } = parsed.data;
  try {
    const modifier = await prisma.$transaction(async (tx) => {
      await tx.userRating.deleteMany({ where: { modifierId: id } });
      return tx.modifier.update({ data: { ...data, weight: weight == null ? null : Math.round(weight), ratings: rating ? { create: { rating } } : undefined }, where: { id }, include: { ratings: true } });
    });
    return NextResponse.json(modifier);
  } catch { return NextResponse.json({ error: "Unable to update modifier." }, { status: 409 }); }
}
