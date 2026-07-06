'use client';

import { useEffect, useState } from 'react';
import { useSpellStore } from '@/data/spellStore';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useSpellStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useSpellStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated;
}
