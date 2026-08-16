export type PricingQuery = { leagueId: string; asOf?: Date };
export type PricingSnapshot = { typicalChaos: number | null; floorChaos: number | null; sampleSize: number; observedAt: Date | null };
export type ObservationInput = { leagueId: string; combinationId: string; originalPrice?: number; originalCurrency?: "DIVINE" | "CHAOS"; normalizedChaosValue?: number; notes?: string };

export interface PriceDataProvider {
  getModifierPricing(modifierId: string, query: PricingQuery): Promise<PricingSnapshot | null>;
  getCombinationPricing(combinationId: string, query: PricingQuery): Promise<PricingSnapshot | null>;
  saveObservation(observation: ObservationInput): Promise<{ id: string }>;
}
