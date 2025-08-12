
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
  luckshots: number; // Represents user's balance. 1 shot = $1 USD
  hasSeenShotInfo: boolean;
  hasSeenVaultInfo: boolean;
  setHasSeenShotInfo: (hasSeen: boolean) => void;
  setHasSeenVaultInfo: (hasSeen: boolean) => void;
  spendLuckshot: (amount?: number) => boolean;
  addLuckshots: (amount: number) => void;
  addToVault: (item: VaultItem) => boolean;
  tradeIn: (vaultItemKey: string, tradeInValue: number) => void;
  moveToShipping: (vaultItemKeys: string[]) => boolean;
  removeFromShipping: (shippingId: string) => void;
  confirmShipping: () => void;
  reset: () => void;
}

const getVaultItemKey = (item: { id: string; purchaseTimestamp: number }) => {
  return `${item.id}-${item.purchaseTimestamp}`;
}

const initialState = {
    vault: [],
    shippingCart: [],
    luckshots: 0, // Start with 0 shots, new users get a bonus
    hasSeenShotInfo: false,
    hasSeenVaultInfo: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHasSeenShotInfo: (hasSeen: boolean) => set({ hasSeenShotInfo: hasSeen }),
      setHasSeenVaultInfo: (hasSeen: boolean) => set({ hasSeenVaultInfo: hasSeen }),

      addLuckshots: (amount) => {
        set((state) => ({ luckshots: state.luckshots + amount }));
      },

      spendLuckshot: (amount = 1) => {
        const currentShots = get().luckshots;
        if (currentShots >= amount) {
          set({ luckshots: currentShots - amount });
          return true;
        }
        return false;
      },
      
      addToVault: (item) => {
        const currentShots = get().luckshots;
        if (currentShots >= item.pricePaid) {
          set((state) => ({
            vault: [...state.vault, item],
            luckshots: state.luckshots - item.pricePaid,
          }));
          return true;
        }
        return false;
      },

      tradeIn: (vaultItemKey, tradeInValue) => {
        set((state) => ({
          vault: state.vault.filter((item) => getVaultItemKey(item) !== vaultItemKey),
          luckshots: state.luckshots + tradeInValue,
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

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: "shopnluck-storage-v6", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
