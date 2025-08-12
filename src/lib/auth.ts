
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './store';

interface User {
  luckyNumber: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  user: User | null;
  login: (method: 'whatsapp' | 'wallet') => void;
  logout: () => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
}

const initialState = {
  isAuthenticated: false,
  isLoggingIn: false,
  user: null,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: (method) => {
        // In a real app, this would involve a complex authentication flow.
        // Here, we simulate a successful login and assign a random lucky number.
        const randomLuckyNumber = String(Math.floor(1000 + Math.random() * 9000));
        set({ 
          isAuthenticated: true,
          isLoggingIn: false,
          user: { luckyNumber: randomLuckyNumber } 
        });
      },
      logout: () => {
        // Also reset the main store on logout
        useStore.getState().reset();
        set({ ...initialState });
      },
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: 'luckshot-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
