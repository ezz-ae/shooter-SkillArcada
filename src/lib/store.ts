
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
  addToVault: (item: Omit<VaultItem, 'discountApplied'>, discount?: number) => void;
  tradeIn: (vaultItemKey: string, tradeInValue: number) => void;
  moveToShipping: (vaultItemKeys: string[]) => boolean;
  removeFromShipping: (shippingId: string) => void;
  confirmShipping: () => void;
  spendFromWallet: (amount: number) => void;
}

const getVaultItemKey = (item: { id: string; purchaseTimestamp: number }) => {
  return `${item.id}-${item.purchaseTimestamp}`;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      vault: [],
      shippingCart: [],
      walletBalance: 10000.0, 

      spendFromWallet: (amount) => {
        set((state) => ({
            walletBalance: state.walletBalance - amount,
        }));
      },
      
      addToVault: (item) => {
        const currentBalance = get().walletBalance;
        if (currentBalance >= item.pricePaid) {
          set((state) => ({
            vault: [...state.vault, item],
            walletBalance: state.walletBalance - item.pricePaid,
          }));
        }
      },

      tradeIn: (vaultItemKey, tradeInValue) => {
        set((state) => ({
          vault: state.vault.filter((item) => getVaultItemKey(item) !== vaultItemKey),
          walletBalance: state.walletBalance + tradeInValue,
        }));
      },
      
      moveToShipping: (vaultItemKeys) => {
        const currentShippingCount = get().shippingCart.length;
        if (currentShippingCount + vaultItemKeys.length > 3) {
            return false; // Violates the 3-item limit
        }

        const itemsToMove = get().vault.filter(item => vaultItemKeys.includes(getVaultItemKey(item)));
        const remainingVault = get().vault.filter(item => !vaultItemKeys.includes(getVaultItemKey(item)));
        
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
        set({ shippingCart: [] });
      },
    }),
    {
      name: "shopnluck-storage-v2", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
