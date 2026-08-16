import type { ObservationInput, PriceDataProvider, PricingQuery, PricingSnapshot } from "./types";

/** Reserved adapter boundary. No API calls are implemented without approved credentials and policy review. */
export abstract class PublicStashPriceProvider implements PriceDataProvider {
  abstract getModifierPricing(modifierId: string, query: PricingQuery): Promise<PricingSnapshot | null>;
  abstract getCombinationPricing(combinationId: string, query: PricingQuery): Promise<PricingSnapshot | null>;
  abstract saveObservation(observation: ObservationInput): Promise<{ id: string }>;
}
