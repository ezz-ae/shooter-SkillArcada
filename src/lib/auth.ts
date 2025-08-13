
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getAuth, signInAnonymously, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { app } from './firebase'; // Import the initialized app
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

// const auth = getAuth(app); // Use the imported, initialized app

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      initializeAuth: () => {
        // const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        //   if (firebaseUser) {
        //     // User is signed in.
        //     const isNew = firebaseUser.metadata.creationTime === firebaseUser.metadata.lastSignInTime;
            
        //     if (isNew && get().isNewUser) {
        //       useStore.getState().addShots(10); // New user bonus
        //     }

        //     set({
        //       isAuthenticated: true,
        //       user: { uid: firebaseUser.uid, isAnonymous: firebaseUser.isAnonymous },
        //       isLoggingIn: false,
        //       isNewUser: isNew,
        //     });
        //   } else {
        //     // User is signed out or not yet signed in.
        //     // Try to sign in anonymously.
        //     signInAnonymously(auth).catch((error) => {
        //       console.error("Anonymous sign-in failed:", error);
        //       set({ isLoggingIn: false });
        //     });
        //   }
        // });
        // return unsubscribe;
        
        // --- WORKAROUND START ---
        console.warn("Firebase Auth is temporarily disabled due to suspended API key.");
        set({
            isAuthenticated: true,
            isLoggingIn: false,
            user: { uid: 'temp-user-id', isAnonymous: true },
            isNewUser: false
        })
        useStore.getState().addShots(10); // Give bonus for demo
        return () => {}; // Return a dummy unsubscribe function
        // --- WORKAROUND END ---
      },
      logout: async () => {
        // await auth.signOut();
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
      name: 'luckshot-auth-storage-v8', // Incremented version
      storage: createJSONStorage(() => localStorage),
      // Only persist non-user-session specific data
      partialize: (state) => ({
        hasAcceptedTerms: state.hasAcceptedTerms,
        isNewUser: state.isNewUser, // Persist isNewUser to avoid re-granting bonus
      }),
    }
  )
);
