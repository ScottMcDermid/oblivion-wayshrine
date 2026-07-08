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
  leveled?: boolean;
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

export type GreaterPowerReference = {
  name: string;
  renown: number;
};

export type NirnrootReference = {
  description: string;
};

export type TrainerTier = 'Novice' | 'Journeyman' | 'Master';

export type TrainerReference = {
  name: string;
  skill: string;
  tier: TrainerTier;
  maxLevel: number;
};

export type LocationDLC = 'Base' | 'SI' | 'KotN';

export const locationDLCs: LocationDLC[] = ['Base', 'SI', 'KotN'];

export const locationDLCLabels: Record<LocationDLC, string> = {
  Base: 'Base Game',
  SI: 'Shivering Isles',
  KotN: 'Knights of the Nine',
};

export const locationDLCColors: Record<LocationDLC, string> = {
  Base: '#6b7280',
  SI: '#a855f7',
  KotN: '#f59e0b',
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
  greaterPowers?: GreaterPowerReference[];
  trainers?: TrainerReference[];
  nirnroots?: NirnrootReference[];
  notes?: string;
};
