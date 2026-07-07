import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocationStatus, LocationType } from '@/utils/locationTypes';
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
  foundSkillBooks: Record<string, boolean>;
  investedMerchants: Record<string, boolean>;
  acquiredItems: Record<string, boolean>;
  typeFilters: LocationType[];
  statusFilters: LocationStatus[];
  version: number;
};

type Actions = {
  setLocationStatus: (id: string, status: LocationStatus) => void;
  toggleQuestCompleted: (locationId: string, questName: string) => void;
  toggleSkillBookFound: (locationId: string, bookTitle: string) => void;
  toggleMerchantInvested: (locationId: string, merchantName: string) => void;
  toggleItemAcquired: (locationId: string, itemName: string) => void;
  toggleTypeFilter: (type: LocationType) => void;
  toggleStatusFilter: (status: LocationStatus) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
};

type LocationStore = State & { actions: Actions };

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      locations: buildDefaultStatuses(),
      completedQuests: {},
      foundSkillBooks: {},
      investedMerchants: {},
      acquiredItems: {},
      typeFilters: [],
      statusFilters: [],
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
        toggleSkillBookFound: (locationId, bookTitle) =>
          set((state) => {
            const key = `${locationId}:${bookTitle}`;
            const { [key]: current, ...rest } = state.foundSkillBooks;
            return { foundSkillBooks: current ? rest : { ...state.foundSkillBooks, [key]: true } };
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
        toggleTypeFilter: (type) =>
          set((state) => ({
            typeFilters: state.typeFilters.includes(type)
              ? state.typeFilters.filter((t) => t !== type)
              : [...state.typeFilters, type],
          })),
        toggleStatusFilter: (status) =>
          set((state) => ({
            statusFilters: state.statusFilters.includes(status)
              ? state.statusFilters.filter((s) => s !== status)
              : [...state.statusFilters, status],
          })),
        clearFilters: () =>
          set({ typeFilters: [], statusFilters: [] }),
        resetToDefaults: () =>
          set({
            locations: buildDefaultStatuses(),
            completedQuests: {},
            foundSkillBooks: {},
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
        foundSkillBooks: state.foundSkillBooks,
        investedMerchants: state.investedMerchants,
        acquiredItems: state.acquiredItems,
        typeFilters: state.typeFilters,
        statusFilters: state.statusFilters,
        version: state.version,
      }),
    },
  ),
);
