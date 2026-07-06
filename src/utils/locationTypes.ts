export type LocationType =
  | 'Ayleid Ruin'
  | 'Camp'
  | 'Castle'
  | 'Cave'
  | 'City'
  | 'Daedric Shrine'
  | 'Farm'
  | 'Fort'
  | 'Inn'
  | 'Landmark'
  | 'Mine'
  | 'Oblivion Gate'
  | 'Settlement'
  | 'Shrine';

export const locationTypes: LocationType[] = [
  'Ayleid Ruin',
  'Camp',
  'Castle',
  'Cave',
  'City',
  'Daedric Shrine',
  'Farm',
  'Fort',
  'Inn',
  'Landmark',
  'Mine',
  'Oblivion Gate',
  'Settlement',
  'Shrine',
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
  notes?: string;
};
