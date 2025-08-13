
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
  shots: number; // Represents user's balance. 1 shot = $1 USD
  luckshots: number; // Represents currency won from skill games
  hasSeenShotInfo: boolean;
  hasSeenVaultInfo: boolean;
  setHasSeenShotInfo: (hasSeen: boolean) => void;
  setHasSeenVaultInfo: (hasSeen: boolean) => void;
  spendShot: (amount?: number) => boolean;
  addShots: (amount: number) => void;
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
    shots: 0, // Start with 0 shots, new users get a bonus
    luckshots: 0,
    hasSeenShotInfo: false,
    hasSeenVaultInfo: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHasSeenShotInfo: (hasSeen: boolean) => set({ hasSeenShotInfo: hasSeen }),
      setHasSeenVaultInfo: (hasSeen: boolean) => set({ hasSeenVaultInfo: hasSeen }),

      addShots: (amount) => {
        set((state) => ({ shots: state.shots + amount }));
      },

      spendShot: (amount = 1) => {
        const currentShots = get().shots;
        if (currentShots >= amount) {
          set({ shots: currentShots - amount });
          return true;
        }
        return false;
      },
      
      addLuckshots: (amount) => {
        set((state) => ({ luckshots: state.luckshots + amount }));
      },

      spendLuckshot: (amount = 1) => {
        const currentLuckshots = get().luckshots;
        if (currentLuckshots >= amount) {
          set({ luckshots: currentLuckshots - amount });
          return true;
        }
        return false;
      },

      addToVault: (item) => {
        const currentShots = get().shots;
        if (currentShots >= item.pricePaid) {
          set((state) => ({
            vault: [...state.vault, item],
            shots: state.shots - item.pricePaid,
          }));
          return true;
        }
        return false;
      },

      tradeIn: (vaultItemKey, tradeInValue) => {
        set((state) => ({
          vault: state.vault.filter((item) => getVaultItemKey(item) !== vaultItemKey),
          shots: state.shots + tradeInValue,
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
      name: "shootergun-storage-v1", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
