import type { IconType } from 'react-icons';
import {
  FaBolt,
  FaBrain,
  FaBriefcaseMedical,
  FaEye,
  FaFeather,
  FaFireAlt,
  FaShieldAlt,
  FaTheaterMasks,
  FaUnlockAlt,
  FaVial,
} from 'react-icons/fa';
import { FaClover, FaShieldHeart } from 'react-icons/fa6';
import {
  GiAnvil,
  GiBreastplate,
  GiCat,
  GiChatBubble,
  GiDevilMask,
  GiDominoMask,
  GiFist,
  GiHood,
  GiLeatherArmor,
  GiLeg,
  GiMeditation,
  GiMuscleUp,
  GiRun,
  GiSpikedMace,
} from 'react-icons/gi';
import { LuSword } from 'react-icons/lu';
import { MdAttachMoney } from 'react-icons/md';
import { TbArcheryArrow } from 'react-icons/tb';

import type { Attribute, School, Skill } from '@/utils/spellEffectUtils';

export const skillIcons: Record<Skill, IconType> = {
  Acrobatics: GiLeg,
  Alchemy: FaVial,
  Alteration: FaFeather,
  Armorer: GiAnvil,
  Athletics: GiRun,
  Blade: LuSword,
  Block: FaShieldAlt,
  Blunt: GiSpikedMace,
  Conjuration: GiDevilMask,
  Destruction: FaFireAlt,
  'Hand-to-Hand': GiFist,
  'Heavy Armor': GiBreastplate,
  Illusion: GiDominoMask,
  'Light Armor': GiLeatherArmor,
  Marksman: TbArcheryArrow,
  Mercantile: MdAttachMoney,
  Mysticism: FaEye,
  Restoration: FaBriefcaseMedical,
  Security: FaUnlockAlt,
  Sneak: GiHood,
  Speechcraft: GiChatBubble,
};

export const schoolIcons: Record<School, IconType> = {
  Alteration: FaFeather,
  Conjuration: GiDevilMask,
  Destruction: FaFireAlt,
  Illusion: GiDominoMask,
  Mysticism: FaEye,
  Restoration: FaBriefcaseMedical,
};

export const attributeIcons: Record<Attribute, IconType> = {
  Strength: GiMuscleUp,
  Intelligence: FaBrain,
  Willpower: GiMeditation,
  Agility: GiCat,
  Speed: FaBolt,
  Endurance: FaShieldHeart,
  Personality: FaTheaterMasks,
  Luck: FaClover,
};

export const luckIcon: IconType = FaClover;
