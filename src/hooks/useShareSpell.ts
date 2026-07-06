'use client';

import { useCallback } from 'react';
import { useSpellStore } from '@/data/spellStore';
import { encodeSpell, type SpellData } from '@/utils/spellCodec';

/**
 * Hook that provides functions to generate and copy a shareable URL
 * for the current spell configuration.
 */
export function useShareSpell() {
  const addedEffects = useSpellStore((s) => s.addedEffects);
  const skills = useSpellStore((s) => s.skills);
  const luck = useSpellStore((s) => s.luck);

  const getShareUrl = useCallback((): string => {
    const spellData: SpellData = {
      skills,
      luck,
      effects: addedEffects,
    };

    const code = encodeSpell(spellData);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/s/${code}`;
  }, [addedEffects, skills, luck]);

  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [getShareUrl]);

  return { getShareUrl, copyShareUrl };
}
