
'use server';

import { z } from 'zod';
import { mockProducts } from './products';

// This is a mock implementation. In a real app, this would write to a database.
// For now, we are just logging the changes.

export const ProductEditInputSchema = z.object({
  productId: z.string().describe("The unique ID of the product to edit, e.g., 'prod_phone_01'."),
  name: z.string().optional().describe("The new name for the product."),
  subtitle: z.string().optional().describe("The new subtitle for the product."),
  description: z.string().optional().describe("The new description for the product."),
  marketPrice: z.number().optional().describe("The new market price for the product."),
});

export type ProductEditInput = z.infer<typeof ProductEditInputSchema>;

export async function updateProductDetails(input: ProductEditInput): Promise<string> {
  const productIndex = mockProducts.findIndex(p => p.id === input.productId);

  if (productIndex === -1) {
    return `Error: Product with ID "${input.productId}" not found.`;
  }

  const product = mockProducts[productIndex];
  let updates: string[] = [];

  if (input.name) {
    product.name = input.name;
    updates.push(`name to "${input.name}"`);
  }
  if (input.subtitle) {
    product.subtitle = input.subtitle;
    updates.push(`subtitle to "${input.subtitle}"`);
  }
  if (input.description) {
    product.description = input.description;
    updates.push('description');
  }
  if (input.marketPrice) {
    product.marketPrice = input.marketPrice;
    updates.push(`market price to $${input.marketPrice.toFixed(2)}`);
  }
  
  if (updates.length === 0) {
    return "No changes were specified for the product.";
  }

  console.log(`SERVER ACTION: Updated product ${product.id}. Changes: ${updates.join(', ')}`);
  
  return `Successfully updated the following for ${product.id}: ${updates.join(', ')}.`;
}
