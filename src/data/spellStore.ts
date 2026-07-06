import type { School, SpellEffect } from '@/utils/spellEffectUtils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { upsert } from '@/utils/array';

type State = {
  addedEffects: SpellEffect[];
  skills: Record<School, number>;
  luck: number;
  version: number;
};

type Action = {
  addSpellEffect: (spellEffect: SpellEffect) => void;
  removeSpellEffect: (spellEffect: SpellEffect) => void;
  setSkills: (skills: Partial<Record<School, number>>) => void;
  setLuck: (luck: number) => void;
  resetSpell: () => void;
  loadSpell: (data: {
    addedEffects: SpellEffect[];
    skills: Record<School, number>;
    luck: number;
  }) => void;
};

type SpellStore = State & { actions: Action };

const useSpellStore = create<SpellStore>()(
  persist(
    (set) => {
      return {
        addedEffects: [],
        skills: {
          Alteration: 100,
          Conjuration: 100,
          Destruction: 100,
          Illusion: 100,
          Mysticism: 100,
          Restoration: 100,
        },
        luck: 50,
        version: 1,
        actions: {
          addSpellEffect: (effect) =>
            set((state) => ({
              addedEffects: upsert<SpellEffect>(state.addedEffects, effect, 'id'),
            })),
          removeSpellEffect: (effect) =>
            set((state) => ({
              addedEffects: state.addedEffects.filter(
                (existingEffect) => effect.id !== existingEffect.id,
              ),
            })),
          setSkills: (skills) => {
            set((state) => ({ skills: { ...state.skills, ...skills } }));
          },
          setLuck: (luck) => {
            set(() => ({ luck }));
          },
          resetSpell: () => {
            set(() => ({ addedEffects: [] }));
          },
          loadSpell: (data) => {
            set(() => ({
              addedEffects: data.addedEffects,
              skills: data.skills,
              luck: data.luck,
            }));
          },
        },
      };
    },
    {
      name: 'oblivion-spell-altar',
      version: 1,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        addedEffects: state.addedEffects,
        skills: state.skills,
        luck: state.luck,
        version: state.version,
      }),
    },
  ),
);

export { useSpellStore };
