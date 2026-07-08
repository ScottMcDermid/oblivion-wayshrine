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

export type TrainerTier = 'Novice' | 'Journeyman' | 'Master';

export type TrainerReference = {
  name: string;
  skill: string;
  tier: TrainerTier;
  maxLevel: number;
};

export type LocationDefinition = {
  id: string;
  name: string;
  type: LocationType;
  hold: string;
  initiallyDiscovered: boolean;
  quests?: QuestReference[];
  skillBooks?: SkillBookReference[];
  merchants?: MerchantReference[];
  uniqueItems?: UniqueItemReference[];
  houses?: HouseReference[];
  greaterPowers?: GreaterPowerReference[];
  trainers?: TrainerReference[];
  notes?: string;
};
