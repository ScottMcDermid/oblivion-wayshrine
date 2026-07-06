import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocationStatus } from '@/utils/locationTypes';
import { locationDefinitions } from '@/data/locations';

function buildDefaultStatuses(): Record<string, LocationStatus> {
  const statuses: Record<string, LocationStatus> = {};
  for (const loc of locationDefinitions) {
    statuses[loc.id] = loc.initiallyDiscovered ? 'discovered' : 'undiscovered';
  }
  return statuses;
}

type State = {
  locations: Record<string, LocationStatus>;
  version: number;
};

type Actions = {
  setLocationStatus: (id: string, status: LocationStatus) => void;
  resetToDefaults: () => void;
};

type LocationStore = State & { actions: Actions };

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locations: buildDefaultStatuses(),
      version: 1,
      actions: {
        setLocationStatus: (id, status) =>
          set((state) => ({
            locations: { ...state.locations, [id]: status },
          })),
        resetToDefaults: () =>
          set({
            locations: buildDefaultStatuses(),
          }),
      },
    }),
    {
      name: 'oblivion-wayshrine',
      partialize: (state) => ({
        locations: state.locations,
        version: state.version,
      }),
    },
  ),
);
