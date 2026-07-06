'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { decodeSpell, type SpellData } from '@/utils/spellCodec';
import SpellAltar from '@/components/SpellAltar';

export default function SharedSpellPage() {
  const params = useParams();
  const [sharedSpell, setSharedSpell] = useState<SpellData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const code = params.code as string;
    if (!code) {
      setFailed(true);
      return;
    }

    const spell = decodeSpell(code);
    if (!spell) {
      setFailed(true);
      return;
    }

    setSharedSpell(spell);
  }, [params.code]);

  if (failed) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#1e1e1e] text-gray-300">
        <p className="text-lg">Invalid or corrupted spell link.</p>
        <a href="/" className="text-yellow-400 underline hover:text-yellow-200">
          Go to spell altar
        </a>
      </div>
    );
  }

  if (!sharedSpell) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1e1e1e]">
        <p className="text-lg text-gray-400">Loading spell...</p>
      </div>
    );
  }

  return <SpellAltar sharedSpell={sharedSpell} />;
}
