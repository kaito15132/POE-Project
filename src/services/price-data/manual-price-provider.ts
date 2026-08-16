import type { PrismaClient } from "@prisma/client";
import type { ObservationInput, PriceDataProvider, PricingQuery, PricingSnapshot } from "./types";

export class ManualPriceProvider implements PriceDataProvider {
  constructor(private readonly db: PrismaClient) {}
  async getModifierPricing(modifierId: string, query: PricingQuery) {
    const combination = await this.db.combination.findFirst({ where: { modifierCount: 1, modifiers: { some: { modifierId } } } });
    return combination ? this.getCombinationPricing(combination.id, query) : null;
  }
  async getCombinationPricing(combinationId: string, query: PricingQuery): Promise<PricingSnapshot | null> {
    const row = await this.db.marketObservation.findFirst({ where: { combinationId, leagueId: query.leagueId, excluded: false, observedAt: query.asOf ? { lte: query.asOf } : undefined }, orderBy: { observedAt: "desc" } });
    return row ? { typicalChaos: row.medianPrice, floorChaos: row.lowestListing, sampleSize: row.numberOfListings ?? 0, observedAt: row.observedAt } : null;
  }
  async saveObservation(input: ObservationInput) {
    return this.db.marketObservation.create({ data: { ...input, source: "MANUAL" }, select: { id: true } });
  }
}
