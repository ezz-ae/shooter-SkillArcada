
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './store';

interface User {
  uid: string;
  isAnonymous: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  user: User | null;
  isNewUser: boolean;
  hasAcceptedTerms: boolean;
  initializeAuth: () => () => void; // Returns the unsubscribe function
  logout: () => void;
  acceptTerms: () => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
}

const initialState = {
  isAuthenticated: false,
  isLoggingIn: true,
  user: null,
  isNewUser: true,
  hasAcceptedTerms: false,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      initializeAuth: () => {
        // This is a temporary workaround to simulate auth without a live Firebase connection.
        console.warn("Firebase Auth is temporarily disabled. Using a mock user session.");
        set({
            isAuthenticated: true,
            isLoggingIn: false,
            user: { uid: 'temp-user-id', isAnonymous: true },
            isNewUser: false
        })
        if (get().isNewUser) {
            useStore.getState().addShots(10); // Give new user bonus for demo
        }
        return () => {}; // Return a dummy unsubscribe function
      },
      logout: async () => {
        useStore.getState().reset();
        const isNewUser = get().isNewUser;
        set({ ...initialState, isLoggingIn: false, isNewUser });
      },
      acceptTerms: () => {
        set({ hasAcceptedTerms: true });
      },
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: 'shootergun-auth-storage-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist non-user-session specific data
      partialize: (state) => ({
        hasAcceptedTerms: state.hasAcceptedTerms,
        isNewUser: state.isNewUser, // Persist isNewUser to avoid re-granting bonus
      }),
    }
  )
);
