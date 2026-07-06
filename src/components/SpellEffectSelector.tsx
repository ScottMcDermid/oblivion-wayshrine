import React, { useState } from 'react';
import { TextField, Button, Chip, Tooltip } from '@mui/material';
import Image from 'next/image';

import {
  getMagickaCost,
  MIN_DURATION,
  MIN_MAGNITUDE,
  MIN_LEVEL_MAGNITUDE,
  schools,
  spellEffectDefinitions,
  attributes,
  skills as selectableSkills,
  lockLevels,
  magnitudeByLockLevel,
  type School,
  type SpellEffect,
  type SpellEffectDefinition,
} from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';
import { schoolIcons } from '@/utils/skillIcons';

function createDefaultEffect(definition: SpellEffectDefinition): SpellEffect {
  const magnitude = definition.availableParameters.includes('Magnitude')
    ? definition.selectableLockLevel
      ? magnitudeByLockLevel[lockLevels[0]]
      : definition.isLevelBasedMagnitude
        ? MIN_LEVEL_MAGNITUDE
        : MIN_MAGNITUDE
    : 0;
  const area = 0;
  const duration = definition.availableParameters.includes('Duration') ? MIN_DURATION : 0;
  const range = definition.availableRanges[0];

  const magickaCost = getMagickaCost({
    baseCost: definition.baseCost,
    isLevelBasedMagnitude: definition.isLevelBasedMagnitude,
    magnitude,
    area,
    duration,
    range,
  });

  return {
    id: definition.id,
    range,
    magnitude,
    area,
    duration,
    magickaCost,
    ...(definition.selectableAttribute && { attribute: attributes[0] }),
    ...(definition.selectableSkill && { skill: selectableSkills[0] }),
    ...(definition.selectableLockLevel && { lockLevel: lockLevels[0] }),
  };
}

export default function SpellEffectSelector({
  onEffectAdded,
}: {
  onEffectAdded: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<School | null>(null);

  const {
    addedEffects,
    actions: { addSpellEffect },
  } = useSpellStore();

  const filteredEffects: SpellEffectDefinition[] = spellEffectDefinitions.filter((effect) => {
    const addedSpellEffectIds = addedEffects.map((effect) => effect.id);
    return (
      effect.name.toLowerCase().includes(search.toLowerCase()) &&
      !addedSpellEffectIds.includes(effect.id) &&
      (schoolFilter === null || effect.school === schoolFilter)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <TextField
        label="Search Effects"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 px-2"
      />

      <div className="mb-2 flex flex-wrap gap-1 px-2">
        {schools.map((school) => {
          const Icon = schoolIcons[school];
          return (
            <Chip
              key={school}
              icon={<Icon className="!text-xs" />}
              label={school}
              size="small"
              variant={schoolFilter === school ? 'filled' : 'outlined'}
              color={schoolFilter === school ? 'primary' : 'default'}
              onClick={() => setSchoolFilter(schoolFilter === school ? null : school)}
              className="text-xs"
            />
          );
        })}
      </div>

      <div className="min-h-0 flex-1">
        <div className="h-full space-y-1 overflow-y-auto rounded-md border border-[#2e2e2e] p-1.5">
          {filteredEffects.map((effect) => (
            <Button
              key={effect.id}
              variant="outlined"
              fullWidth
              onClick={() => {
                const defaultEffect = createDefaultEffect(effect);
                addSpellEffect(defaultEffect);
                onEffectAdded(effect.id);
                setSearch('');
              }}
              className="justify-start text-left normal-case"
            >
              <div className="flex items-center gap-2 p-0.5">
                <Tooltip title={effect.school}>
                  <Image
                    src={`/icons/spell-effects/${effect.id}.png`}
                    width={64}
                    height={64}
                    alt={effect.name}
                    className="h-7 w-7 lg:h-9 lg:w-9"
                  />
                </Tooltip>
                <span className="flex-1 text-sm lg:text-base">{effect.name}</span>
              </div>
            </Button>
          ))}

          {filteredEffects.length === 0 && <div className="text-sm italic">No effects found.</div>}
        </div>
      </div>
    </div>
  );
}
