export type LocationType =
  | 'Ayleid Ruin'
  | 'Birthsign Stone'
  | 'Camp'
  | 'Cave'
  | 'City'
  | 'Daedric Shrine'
  | 'Farm'
  | 'Fort'
  | 'Heaven Stone'
  | 'Inn'
  | 'Landmark'
  | 'Mine'
  | 'Oblivion Gate'
  | 'Ruin'
  | 'Settlement';

export const locationTypes: LocationType[] = [
  'Ayleid Ruin',
  'Birthsign Stone',
  'Camp',
  'Cave',
  'City',
  'Daedric Shrine',
  'Farm',
  'Fort',
  'Heaven Stone',
  'Inn',
  'Landmark',
  'Mine',
  'Oblivion Gate',
  'Ruin',
  'Settlement',
];

export type LocationStatus = 'undiscovered' | 'discovered' | 'cleared';

export const locationStatuses: LocationStatus[] = ['undiscovered', 'discovered', 'cleared'];

export type QuestReference = {
  name: string;
  leveled?: number;
  dlc?: LocationDLC;
};

export type SkillBookReference = {
  title: string;
  skill: string;
};

export type MerchantReference = {
  name: string;
};

export type UniqueItemReference = {
  name: string;
};

export type HouseReference = {
  name: string;
  price: number;
};

export type HorseReference = {
  name: string;
  price: number;
};

export type GreaterPowerReference = {
  name: string;
  renown: number;
};

export type NirnrootReference = {
  description: string;
};

export type BeggarReference = {
  name: string;
  location: string;
};

export type TrainerTier = 'Novice' | 'Journeyman' | 'Master';

export type TrainerReference = {
  name: string;
  skill: string;
  tier: TrainerTier;
  maxLevel: number;
};

// Quests whose leveled reward thresholds are corrected by the Unofficial Oblivion Patch.
// The data stores UOP-corrected values; these are the vanilla (unpatched) equivalents.
export const vanillaLeveledOverrides: Record<string, number> = {
  'The Ghost Ship of Anvil':   1,
  'Information Gathering':     5,
  "Mystery at Harlun's Watch": 10,
  'Blood of the Divines':      15,
};

export type LocationDLC = 'Base' | 'SI' | 'KotN' | 'Plugins' | 'Remastered';

export const locationDLCs: LocationDLC[] = ['Base', 'SI', 'KotN', 'Plugins', 'Remastered'];

export const locationDLCLabels: Record<LocationDLC, string> = {
  Base: 'Base Game',
  SI: 'Shivering Isles',
  KotN: 'Knights of the Nine',
  Plugins: 'Official Plugins',
  Remastered: 'Oblivion Remastered',
};

export const locationDLCColors: Record<LocationDLC, string> = {
  Base: '#6b7280',
  SI: '#a855f7',
  KotN: '#f59e0b',
  Plugins: '#06b6d4',
  Remastered: '#ef4444',
};

export type LocationDefinition = {
  id: string;
  name: string;
  type: LocationType;
  hold: string;
  dlc?: LocationDLC;
  initiallyDiscovered: boolean;
  quests?: QuestReference[];
  skillBooks?: SkillBookReference[];
  merchants?: MerchantReference[];
  uniqueItems?: UniqueItemReference[];
  houses?: HouseReference[];
  horses?: HorseReference[];
  greaterPowers?: GreaterPowerReference[];
  trainers?: TrainerReference[];
  nirnroots?: NirnrootReference[];
  beggars?: BeggarReference[];
  notes?: string;
};
