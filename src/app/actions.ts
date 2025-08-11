"use server";

import { getAlgorithmicPrice, type AlgorithmicPricingInput } from "@/ai/flows/algorithmic-pricing";

export async function fetchUpdatedPrice(input: AlgorithmicPricingInput) {
    const priceData = await getAlgorithmicPrice(input);
    return priceData;
}
