import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Screen } from '../types';

interface ScreensState {
  screens: Screen[];
  selectedScreen: Screen | null;
  isLoading: boolean;
  error: string | null;
  setScreens: (screens: Screen[]) => void;
  setSelectedScreen: (screen: Screen | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateScreenSettings: (screenId: string, settings: Partial<Screen>) => void;
}

export const useScreensStore = create<ScreensState>()(
  devtools(
    (set) => ({
      screens: [],
      selectedScreen: null,
      isLoading: false,
      error: null,
      setScreens: (screens) => set({ screens }),
      setSelectedScreen: (screen) => set({ selectedScreen: screen }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      updateScreenSettings: (screenId, settings) =>
        set((state) => ({
          screens: state.screens.map((screen) =>
            screen.id === screenId ? { ...screen, ...settings } : screen
          ),
          selectedScreen:
            state.selectedScreen?.id === screenId
              ? { ...state.selectedScreen, ...settings }
              : state.selectedScreen,
        })),
    }),
    {
      name: 'screens-store',
    }
  )
);