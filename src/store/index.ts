// this file is part of the Zustand store setup for this React application
//src/store/index.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RootState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<RootState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'root-store',
    }
  )
);