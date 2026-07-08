import { LocationDLC } from '@/utils/locationTypes';

export const disambiguationNames = new Set([
  'Priory of the Nine',
  'Weynon Priory',
  'Miscarcand',
]);

export function buildUespUrl(
  name: string,
  dlc?: LocationDLC,
  disambiguation?: 'place' | 'quest',
): string {
  const prefix = dlc === 'SI' ? 'Shivering' : 'Oblivion';
  let pageName = name.replace(/ /g, '_');
  if (disambiguation) {
    pageName += disambiguation === 'place' ? '_(place)' : '_(quest)';
  }
  return `https://en.uesp.net/wiki/${prefix}:${pageName}`;
}
