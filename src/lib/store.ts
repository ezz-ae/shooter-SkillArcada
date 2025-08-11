import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./products";

export interface VaultItem extends Product {
  pricePaid: number;
  purchaseTimestamp: number;
}

export interface ShippingItem extends VaultItem {
  shippingId: string;
}

interface StoreState {
  vault: VaultItem[];
  shippingCart: ShippingItem[];
  walletBalance: number;
  addToVault: (item: VaultItem) => void;
  tradeIn: (itemId: string, tradeInValue: number) => void;
  moveToShipping: (itemIds: string[]) => boolean;
  removeFromShipping: (shippingId: string) => void;
  confirmShipping: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      vault: [],
      shippingCart: [],
      walletBalance: 1000.0, // Start with some money

      addToVault: (item) => {
        if (get().vault.length >= 20) {
          // Limit vault size
          return;
        }
        const currentBalance = get().walletBalance;
        if (currentBalance >= item.pricePaid) {
          set((state) => ({
            vault: [...state.vault, item],
            walletBalance: state.walletBalance - item.pricePaid,
          }));
        }
      },

      tradeIn: (itemId, tradeInValue) => {
        set((state) => ({
          vault: state.vault.filter((item) => item.id !== itemId),
          walletBalance: state.walletBalance + tradeInValue,
        }));
      },
      
      moveToShipping: (itemIds) => {
        const currentShippingCount = get().shippingCart.length;
        if (currentShippingCount + itemIds.length > 3) {
            return false; // Violates the 3-item limit
        }

        const itemsToMove = get().vault.filter(item => itemIds.includes(item.id));
        const remainingVault = get().vault.filter(item => !itemIds.includes(item.id));
        
        const shippingItems = itemsToMove.map(item => ({...item, shippingId: `ship_${item.id}_${Date.now()}`}))

        set(state => ({
            vault: remainingVault,
            shippingCart: [...state.shippingCart, ...shippingItems]
        }));
        return true;
      },

      removeFromShipping: (shippingId) => {
        const itemToMoveBack = get().shippingCart.find(item => item.shippingId === shippingId);
        if (itemToMoveBack) {
            const newShippingCart = get().shippingCart.filter(item => item.shippingId !== shippingId);
            const { shippingId: _, ...vaultItem } = itemToMoveBack;
            set(state => ({
                shippingCart: newShippingCart,
                vault: [...state.vault, vaultItem]
            }))
        }
      },

      confirmShipping: () => {
        // Here you would typically call an API to process the shipment
        // For the MVP, we just clear the shipping cart.
        set({ shippingCart: [] });
      },
    }),
    {
      name: "shopnluck-storage", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
