import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------  Auth Store  -------------------------------------------
// Global auth state for JWT authentication (works across all components)
export interface AuthUser {
  userId: string;
  email: string;
  name: string | null;
  image?: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  setUser: (user: AuthUser | null) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setInitialized: (isInitialized: boolean) => set({ isInitialized }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

///////////////////////////////////////////////////////
//         ______
//        |_   _ \
//  ____    | |_) |  .---.  ,--.   _ .--.
// [_   ]   |  __'. / /__\\`'_\ : [ `/'`\]
//  .' /_  _| |__) || \__.,// | |, | |
// [_____]|_______/  '.__.'\'-;__/[___]
///////////////////////////////////////////////////////
// // Zustand Bear Example:
interface BearState {
  bears: number;
  increaseBears: () => void;
  decreaseBears: () => void;
  removeAllBears: () => void;
}

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      bears: 0,
      increaseBears: () => set((state) => ({ bears: state.bears + 1 })),
      decreaseBears: () => set((state) => ({ bears: state.bears - 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }),
    {
      name: 'bear store',
    },
  ),
);
