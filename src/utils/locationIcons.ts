import { IconType } from 'react-icons';
import {
  GiIonicColumn,
  GiCaveEntrance,
  GiCapitol,
  GiFireShrine,
  GiBeerStein,
  GiMagicPortal,
  GiMenhir,
  GiVillage,
} from 'react-icons/gi';
import { FaCampground } from 'react-icons/fa';
import { PiBarnFill, PiCastleTurretFill } from 'react-icons/pi';
import { MdTerrain } from 'react-icons/md';
import { TbPick } from 'react-icons/tb';
import { LocationType } from '@/utils/locationTypes';

export const locationTypeIcons: Record<LocationType, IconType> = {
  'Ayleid Ruin': GiIonicColumn,
  'Birthsign Stone': GiMenhir,
  'Camp': FaCampground,
  'Cave': GiCaveEntrance,
  'City': GiCapitol,
  'Daedric Shrine': GiFireShrine,
  'Farm': PiBarnFill,
  'Fort': PiCastleTurretFill,
  'Heaven Stone': GiMenhir,
  'Inn': GiBeerStein,
  'Landmark': MdTerrain,
  'Mine': TbPick,
  'Oblivion Gate': GiMagicPortal,
  'Ruin': PiCastleTurretFill,
  'Settlement': GiVillage,
};
