'use client';

import { useEffect, useState } from 'react';
import { useLocationStore } from '@/data/locationStore';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useLocationStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useLocationStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  return hydrated;
}
