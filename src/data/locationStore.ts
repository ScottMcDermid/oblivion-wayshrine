import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LocationDLC, LocationStatus, LocationType } from '@/utils/locationTypes';
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
  acquiredPowers: Record<string, boolean>;
  purchasedHouses: Record<string, boolean>;
  collectedNirnroots: Record<string, boolean>;
  typeFilters: LocationType[];
  statusFilters: LocationStatus[];
  dlcFilters: LocationDLC[];
  version: number;
};

type Actions = {
  setLocationStatus: (id: string, status: LocationStatus) => void;
  toggleQuestCompleted: (questName: string) => void;
  toggleSkillBookFound: (locationId: string, bookTitle: string) => void;
  toggleMerchantInvested: (locationId: string, merchantName: string) => void;
  toggleItemAcquired: (locationId: string, itemName: string) => void;
  togglePowerAcquired: (locationId: string, powerName: string) => void;
  toggleHousePurchased: (locationId: string, houseName: string) => void;
  toggleNirnrootCollected: (locationId: string, description: string) => void;
  toggleTypeFilter: (type: LocationType) => void;
  toggleStatusFilter: (status: LocationStatus) => void;
  toggleDLCFilter: (dlc: LocationDLC) => void;
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
      acquiredPowers: {},
      purchasedHouses: {},
      collectedNirnroots: {},
      typeFilters: [],
      statusFilters: [],
      dlcFilters: [],
      version: 4,
      actions: {
        setLocationStatus: (id, status) =>
          set((state) => ({
            locations: { ...state.locations, [id]: status },
          })),
        toggleQuestCompleted: (questName) =>
          set((state) => {
            const { [questName]: current, ...rest } = state.completedQuests;
            return { completedQuests: current ? rest : { ...state.completedQuests, [questName]: true } };
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
        togglePowerAcquired: (locationId, powerName) =>
          set((state) => {
            const key = `${locationId}:${powerName}`;
            const { [key]: current, ...rest } = state.acquiredPowers;
            return { acquiredPowers: current ? rest : { ...state.acquiredPowers, [key]: true } };
          }),
        toggleHousePurchased: (locationId, houseName) =>
          set((state) => {
            const key = `${locationId}:${houseName}`;
            const { [key]: current, ...rest } = state.purchasedHouses;
            return { purchasedHouses: current ? rest : { ...state.purchasedHouses, [key]: true } };
          }),
        toggleNirnrootCollected: (locationId, description) =>
          set((state) => {
            const key = `${locationId}:${description}`;
            const { [key]: current, ...rest } = state.collectedNirnroots;
            return { collectedNirnroots: current ? rest : { ...state.collectedNirnroots, [key]: true } };
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
        toggleDLCFilter: (dlc) =>
          set((state) => ({
            dlcFilters: state.dlcFilters.includes(dlc)
              ? state.dlcFilters.filter((d) => d !== dlc)
              : [...state.dlcFilters, dlc],
          })),
        clearFilters: () =>
          set({ typeFilters: [], statusFilters: [], dlcFilters: [] }),
        resetToDefaults: () =>
          set({
            locations: buildDefaultStatuses(),
            completedQuests: {},
            foundSkillBooks: {},
            investedMerchants: {},
            acquiredItems: {},
            acquiredPowers: {},
            purchasedHouses: {},
            collectedNirnroots: {},
          }),
      },
    }),
    {
      name: 'oblivion-wayshrine',
      version: 4,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          // Migrate completedQuests from "locationId:questName" keys to just "questName" keys
          const old = (state.completedQuests ?? {}) as Record<string, boolean>;
          const migrated: Record<string, boolean> = {};
          for (const key of Object.keys(old)) {
            const colonIndex = key.indexOf(':');
            const questName = colonIndex >= 0 ? key.slice(colonIndex + 1) : key;
            // Also strip "(Daedric Quest)" suffix from old keys
            const normalized = questName.replace(/ \(Daedric Quest\)$/, '');
            migrated[normalized] = true;
          }
          state.completedQuests = migrated;
          state.version = 2;
        }
        if (version < 3) {
          // Rename "Harlun's Watch Investigation" to "Mystery at Harlun's Watch"
          const quests = (state.completedQuests ?? {}) as Record<string, boolean>;
          if (quests["Harlun's Watch Investigation"]) {
            const { ["Harlun's Watch Investigation"]: _dropped, ...rest } = quests;
            void _dropped;
            state.completedQuests = { ...rest, "Mystery at Harlun's Watch": true };
          }
          state.version = 3;
        }
        if (version < 4) {
          // Rename "Miscarcand (Main Quest)" to "Miscarcand"
          const quests = (state.completedQuests ?? {}) as Record<string, boolean>;
          if (quests['Miscarcand (Main Quest)']) {
            const { ['Miscarcand (Main Quest)']: _dropped, ...rest } = quests;
            void _dropped;
            state.completedQuests = { ...rest, 'Miscarcand': true };
          }
          state.version = 4;
        }
        return state as LocationStore;
      },
      partialize: (state) => ({
        locations: state.locations,
        completedQuests: state.completedQuests,
        foundSkillBooks: state.foundSkillBooks,
        investedMerchants: state.investedMerchants,
        acquiredItems: state.acquiredItems,
        acquiredPowers: state.acquiredPowers,
        purchasedHouses: state.purchasedHouses,
        collectedNirnroots: state.collectedNirnroots,
        typeFilters: state.typeFilters,
        statusFilters: state.statusFilters,
        dlcFilters: state.dlcFilters,
        version: state.version,
      }),
    },
  ),
);
