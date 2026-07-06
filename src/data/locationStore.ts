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
  completedQuests: Record<string, boolean>;
  investedMerchants: Record<string, boolean>;
  acquiredItems: Record<string, boolean>;
  version: number;
};

type Actions = {
  setLocationStatus: (id: string, status: LocationStatus) => void;
  toggleQuestCompleted: (locationId: string, questName: string) => void;
  toggleMerchantInvested: (locationId: string, merchantName: string) => void;
  toggleItemAcquired: (locationId: string, itemName: string) => void;
  resetToDefaults: () => void;
};

type LocationStore = State & { actions: Actions };

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locations: buildDefaultStatuses(),
      completedQuests: {},
      investedMerchants: {},
      acquiredItems: {},
      version: 1,
      actions: {
        setLocationStatus: (id, status) =>
          set((state) => ({
            locations: { ...state.locations, [id]: status },
          })),
        toggleQuestCompleted: (locationId, questName) =>
          set((state) => {
            const key = `${locationId}:${questName}`;
            const { [key]: current, ...rest } = state.completedQuests;
            return { completedQuests: current ? rest : { ...state.completedQuests, [key]: true } };
          }),
        toggleMerchantInvested: (locationId, merchantName) =>
          set((state) => {
            const key = `${locationId}:${merchantName}`;
            const { [key]: current, ...rest } = state.investedMerchants;
            return { investedMerchants: current ? rest : { ...state.investedMerchants, [key]: true } };
          }),
        toggleItemAcquired: (locationId, itemName) =>
          set((state) => {
            const key = `${locationId}:${itemName}`;
            const { [key]: current, ...rest } = state.acquiredItems;
            return { acquiredItems: current ? rest : { ...state.acquiredItems, [key]: true } };
          }),
        resetToDefaults: () =>
          set({
            locations: buildDefaultStatuses(),
            completedQuests: {},
            investedMerchants: {},
            acquiredItems: {},
          }),
      },
    }),
    {
      name: 'oblivion-wayshrine',
      partialize: (state) => ({
        locations: state.locations,
        completedQuests: state.completedQuests,
        investedMerchants: state.investedMerchants,
        acquiredItems: state.acquiredItems,
        version: state.version,
      }),
    },
  ),
);
