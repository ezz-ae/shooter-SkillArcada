
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

const EARNED_SHOT_VALUE_USD = 0.5; // Each earned shot is worth $0.50

interface StoreState {
  vault: VaultItem[];
  shippingCart: ShippingItem[];
  walletBalance: number;
  luckshots: number; // For playing games
  earnedShots: number; // Won from games, redeemable
  hasSeenShotInfo: boolean;
  hasSeenVaultInfo: boolean;
  hasTradedForShots: boolean;
  setHasSeenShotInfo: (hasSeen: boolean) => void;
  setHasSeenVaultInfo: (hasSeen: boolean) => void;
  addEarnedShots: (amount: number) => void;
  spendLuckshot: (amount?: number) => boolean;
  addToVault: (item: VaultItem) => void;
  tradeIn: (vaultItemKey: string, tradeInValue: number, tradeInType: 'cash' | 'shots') => void;
  moveToShipping: (vaultItemKeys: string[]) => boolean;
  removeFromShipping: (shippingId: string) => void;
  confirmShipping: () => void;
  spendFromWallet: (amount: number) => void;
  redeemEarnedShots: () => void;
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
      luckshots: 5,
      earnedShots: 0,
      hasSeenShotInfo: false,
      hasSeenVaultInfo: false,
      hasTradedForShots: false,

      setHasSeenShotInfo: (hasSeen: boolean) => set({ hasSeenShotInfo: hasSeen }),
      setHasSeenVaultInfo: (hasSeen: boolean) => set({ hasSeenVaultInfo: hasSeen }),

      addEarnedShots: (amount) => {
        set((state) => ({ earnedShots: state.earnedShots + amount }));
      },

      spendLuckshot: (amount = 1) => {
        const currentShots = get().luckshots;
        if (currentShots >= amount) {
          set({ luckshots: currentShots - amount });
          return true;
        }
        return false;
      },

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

      tradeIn: (vaultItemKey, tradeInValue, tradeInType) => {
        if (tradeInType === 'cash') {
          set((state) => ({
            vault: state.vault.filter((item) => getVaultItemKey(item) !== vaultItemKey),
            walletBalance: state.walletBalance + tradeInValue,
          }));
        } else if (tradeInType === 'shots') {
          set((state) => ({
            vault: state.vault.filter((item) => getVaultItemKey(item) !== vaultItemKey),
            luckshots: state.luckshots + 20,
            hasTradedForShots: true,
          }));
        }
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

      redeemEarnedShots: () => {
        const { earnedShots } = get();
        const valueToRedeem = earnedShots * EARNED_SHOT_VALUE_USD;
        if (valueToRedeem >= 10) {
          set(state => ({
            earnedShots: 0,
            walletBalance: state.walletBalance + valueToRedeem,
          }));
        }
      },
    }),
    {
      name: "shopnluck-storage-v3", 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
