import { ModifierCatalog } from "@/components/modifier-catalog";
import { Sidebar } from "@/components/sidebar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export default async function ModifiersPage() {
  const modifiers = await prisma.modifier.findMany({ include: { ratings: true }, orderBy: [{ aura: "asc" }, { displayText: "asc" }] });
  return <div className="lg:flex"><Sidebar/><main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10"><ModifierCatalog initialModifiers={modifiers}/></main></div>;
}
