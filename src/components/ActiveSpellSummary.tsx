import React, { useMemo } from 'react';
import { useSpellStore } from '@/data/spellStore';
import {
  School,
  SpellEffect,
  spellEffectDefinitionById,
  applySkillMultiplier,
  getMasteryFromMagickaCost,
  getMinLevelForMastery,
  Mastery,
  getGoldCost,
} from '@/utils/spellEffectUtils';
import { Tooltip } from '@mui/material';
import FlashOn from '@mui/icons-material/FlashOn';
import AttachMoney from '@mui/icons-material/AttachMoney';
import { cn } from '@/utils/cn';

export default function ActiveSpellEffects() {
  const { addedEffects, skills, luck } = useSpellStore();

  const maxEffect: SpellEffect | undefined = useMemo(
    () =>
      addedEffects.reduce<SpellEffect | undefined>(
        (max, effect) =>
          !max || Math.floor(effect.magickaCost) > Math.floor(max.magickaCost) ? effect : max,
        undefined,
      ),
    [addedEffects],
  );

  const school: School | null = useMemo(
    () => (maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null),
    [maxEffect],
  );

  const mastery: Mastery | null = useMemo(
    () => (maxEffect ? getMasteryFromMagickaCost(maxEffect.magickaCost) : null),
    [maxEffect],
  );

  const magickaCost = useMemo(
    () =>
      addedEffects.reduce(
        (magickaCost, effect) =>
          magickaCost +
          applySkillMultiplier(
            effect.magickaCost,
            skills[spellEffectDefinitionById[effect.id].school],
            luck,
          ),
        0,
      ),
    [addedEffects, skills, luck],
  );

  const minLevel = useMemo(() => (mastery ? getMinLevelForMastery(mastery) : 0), [mastery]);

  const goldCost = useMemo(() => getGoldCost(magickaCost), [magickaCost]);

  return (
    <div className="w-full p-2 shadow-sm">
      {school && mastery && (
        <div
          className={cn(
            'mt-4 flex items-center justify-end gap-4 text-lg',
            minLevel > skills[school] && 'text-error',
          )}
        >
          {school} {mastery}
        </div>
      )}
      {school && minLevel > 0 && (
        <div
          className={cn(
            'flex items-center justify-end gap-4',
            minLevel > skills[school] && 'text-error',
          )}
        >
          Level {minLevel}
        </div>
      )}
      <div className="mt-4 flex justify-end gap-4 text-lg">
        <div className="mt-4 flex items-center gap-4 text-lg">
          <Tooltip title="Magicka Cost">
            <div className="flex items-center gap-1">
              <FlashOn fontSize="small" />
              <span>{Intl.NumberFormat().format(magickaCost)}</span>
            </div>
          </Tooltip>

          <Tooltip title="Gold Cost">
            <div className="flex items-center gap-1">
              <AttachMoney fontSize="small" />
              <span>{Intl.NumberFormat().format(goldCost)}</span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
