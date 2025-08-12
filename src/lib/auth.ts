
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from './store';
import { mockUsers } from './user';

interface User {
  luckyNumber: string;
  avatarUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  user: User | null;
  isNewUser: boolean;
  login: (method: 'whatsapp' | 'wallet') => void;
  logout: () => void;
  setIsLoggingIn: (isLoggingIn: boolean) => void;
}

const initialState = {
  isAuthenticated: false,
  isLoggingIn: false,
  user: null,
  isNewUser: true,
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: (method) => {
        // In a real app, this would involve a complex authentication flow.
        // Here, we simulate a successful login and assign a random lucky number and avatar.
        
        // If user is already authenticated, do nothing.
        if (get().isAuthenticated) return;

        const randomLuckyNumber = String(Math.floor(1000 + Math.random() * 9000));
        const randomAvatar = mockUsers[Math.floor(Math.random() * mockUsers.length)].avatarUrl;
        
        if (get().isNewUser) {
            // Give 3 free shots to new users
            useStore.getState().addLuckshots(3);
        }

        set({ 
          isAuthenticated: true,
          isLoggingIn: false,
          user: { luckyNumber: randomLuckyNumber, avatarUrl: randomAvatar },
          isNewUser: false, // Mark as not a new user after first login
        });
      },
      logout: () => {
        // Also reset the main store on logout
        useStore.getState().reset();
        // Keep the isNewUser state on logout, but reset everything else.
        // This is a bit tricky, so we grab isNewUser before setting initial state.
        const isNewUser = get().isNewUser;
        set({ ...initialState, isNewUser });
      },
      setIsLoggingIn: (isLoggingIn) => set({ isLoggingIn }),
    }),
    {
      name: 'luckshot-auth-storage-v4', // Incremented version
      storage: createJSONStorage(() => localStorage),
    }
  )
);
