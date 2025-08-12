
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './store';

interface User {
  luckyNumber: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  showSignup: boolean;
  user: User | null;
  login: (method: 'whatsapp' | 'wallet') => void;
  logout: () => void;
  completeSignup: (luckyNumber: string) => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
  setShowSignup: (showSignup: boolean) => void;
}

const initialState = {
  isAuthenticated: false,
  isLoggingIn: false,
  showSignup: false,
  user: null,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: (method) => {
        // In a real app, this would involve a complex authentication flow via WhatsApp/Wallet.
        // The user must connect a wallet or WhatsApp to have a fully active account.
        // Here, we'll just simulate a successful login and show the final signup step.
        set({ isLoggingIn: false, showSignup: true });
      },
      logout: () => {
        // Also reset the main store on logout
        useStore.getState().reset();
        set({ ...initialState });
      },
      completeSignup: (luckyNumber) => {
        // This is the final step after a successful Wallet/WhatsApp login.
        // A backend would verify the lucky number is unique before completing signup.
        set({
          isAuthenticated: true,
          showSignup: false,
          user: { luckyNumber },
        });
      },
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
      setShowSignup: (showSignup) => set({ showSignup }),
    }),
    {
      name: 'luckshot-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
