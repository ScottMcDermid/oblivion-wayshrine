'use client';

import React, { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, Snackbar, StyledEngineProvider } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import GitHubIcon from '@mui/icons-material/GitHub';
import theme from '@/app/theme';

import SpellEffectSelector from '@/components/SpellEffectSelector';
import ActiveSpellEffects, { EffectsSkeleton } from '@/components/ActiveSpellEffects';
import ActiveSpellSummary from '@/components/ActiveSpellSummary';
import CharacterSkillsDrawer from '@/components/CharacterSkillsDrawer';
import ConfirmDialog from '@/components/ConfirmDialog';

import { useSpellStore } from '@/data/spellStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useShareSpell } from '@/hooks/useShareSpell';
import { type SpellData } from '@/utils/spellCodec';
import {
  applySkillMultiplier,
  getGoldCost,
  getMasteryFromMagickaCost,
  getMinLevelForMastery,
  spellEffectDefinitionById,
  type School,
  type SpellEffect,
} from '@/utils/spellEffectUtils';
import { cn } from '@/utils/cn';
import { schoolIcons, luckIcon as LuckIcon } from '@/utils/skillIcons';

function SharedSpellSummary({ sharedSpell }: { sharedSpell: SpellData }) {
  const { skills, luck, effects } = sharedSpell;

  const maxEffect = useMemo(
    () =>
      effects.reduce<SpellEffect | undefined>(
        (max, effect) =>
          !max || Math.floor(effect.magickaCost) > Math.floor(max.magickaCost) ? effect : max,
        undefined,
      ),
    [effects],
  );

  const school: School | null = useMemo(
    () => (maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null),
    [maxEffect],
  );

  const mastery = useMemo(
    () => (maxEffect ? getMasteryFromMagickaCost(maxEffect.magickaCost) : null),
    [maxEffect],
  );

  const magickaCost = useMemo(
    () =>
      effects.reduce(
        (total, effect) =>
          total +
          applySkillMultiplier(
            effect.magickaCost,
            skills[spellEffectDefinitionById[effect.id].school],
            luck,
          ),
        0,
      ),
    [effects, skills, luck],
  );

  const minLevel = useMemo(
    () => (mastery ? getMinLevelForMastery(mastery) : 0),
    [mastery],
  );

  const goldCost = useMemo(() => getGoldCost(magickaCost), [magickaCost]);

  const relevantSchools = useMemo(
    () => Array.from(new Set(effects.map((e) => spellEffectDefinitionById[e.id].school))),
    [effects],
  );

  if (effects.length === 0) return null;

  return (
    <div className="w-full p-2 shadow-sm">
      {/* Relevant skills */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
        {relevantSchools.map((s) => {
          const Icon = schoolIcons[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <Icon className="text-base" />
              <span>
                {s}: {skills[s]}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5">
          <LuckIcon className="text-base" />
          <span>Luck: {luck}</span>
        </div>
      </div>

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
          <div className="flex items-center gap-1">
            <span>{Intl.NumberFormat().format(magickaCost)} Magicka</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{Intl.NumberFormat().format(goldCost)} Gold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpellAltar({ sharedSpell }: { sharedSpell?: SpellData }) {
  const {
    addedEffects,
    actions: { resetSpell, loadSpell },
  } = useSpellStore();
  const { copyShareUrl } = useShareSpell();
  const hydrated = useHydrated();

  const isViewOnly = !!sharedSpell;

  const [isCharacterSkillsOpen, setIsCharacterSkillsOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [expandedEffectId, setExpandedEffectId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleReset = (confirm: boolean) => {
    if (confirm) {
      resetSpell();
      setExpandedEffectId(null);
    }
    setIsConfirmingReset(false);
  };

  const handleShare = async () => {
    const success = await copyShareUrl();
    setSnackbarMessage(success ? 'Link copied to clipboard!' : 'Failed to copy link');
  };

  const handleCopyToMyAltar = () => {
    if (!sharedSpell) return;
    loadSpell({
      addedEffects: sharedSpell.effects,
      skills: sharedSpell.skills,
      luck: sharedSpell.luck,
    });
    setSnackbarMessage('Spell copied to your altar!');
    window.location.href = '/';
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Shared spell banner */}
        {isViewOnly && (
          <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 bg-yellow-900/80 px-4 py-2 text-sm text-yellow-200">
            <span>Viewing a shared spell</span>
            <div className="flex gap-2">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCopyToMyAltar}
                className="text-xs normal-case"
              >
                Copy to my altar
              </Button>
              <Button
                size="small"
                variant="outlined"
                href="/"
                className="border-yellow-200/50 text-xs normal-case text-yellow-200"
              >
                Back to my altar
              </Button>
            </div>
          </div>
        )}

        <h1 className="absolute w-screen text-center text-lg">Oblivion Spell Altar</h1>
        <div className="max-w-screen m-auto flex min-h-screen max-w-6xl flex-col bg-inherit">
          {/* Nav bar */}
          <div className="z-20 flex h-12 w-full flex-row justify-between px-2 pt-6 sm:pt-2">
            {!isViewOnly && (
              <div className="flex place-items-center">
                <Button
                  variant="contained"
                  aria-label="Adjust your skills"
                  onClick={() => setIsCharacterSkillsOpen(true)}
                >
                  <BookIcon />
                  <div className="hidden sm:block">&nbsp;Skills</div>
                </Button>
                {addedEffects.length > 0 && (
                  <>
                    <Button
                      className="mx-2"
                      color="error"
                      aria-label="Reset Spell"
                      onClick={() => setIsConfirmingReset(true)}
                    >
                      <DeleteIcon />
                      <div className="hidden sm:block">&nbsp;Reset</div>
                    </Button>
                    <Button
                      aria-label="Share Spell"
                      onClick={handleShare}
                    >
                      <ShareIcon />
                      <div className="hidden sm:block">&nbsp;Share</div>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex w-full flex-1 flex-col gap-6 bg-inherit pt-4 sm:flex-row">
            {/* Spell effect selector (hidden in view-only mode) */}
            {!isViewOnly && (
              <div className="flex max-h-80 flex-shrink-0 flex-col sm:sticky sm:top-14 sm:max-h-[calc(100vh-3.5rem)] sm:max-w-80">
                <SpellEffectSelector
                  onEffectAdded={(id) => setExpandedEffectId(id)}
                />
              </div>
            )}

            <div className={cn(
              'mt-3 flex-1 bg-inherit lg:max-w-full',
              isViewOnly && 'mx-auto max-w-4xl',
            )}>
              {isViewOnly ? (
                <>
                  <ActiveSpellEffects
                    expandedEffectId={null}
                    onToggleExpand={() => {}}
                    viewOnlyEffects={sharedSpell.effects}
                    viewOnlySkills={sharedSpell.skills}
                    viewOnlyLuck={sharedSpell.luck}
                  />
                  <div className="mt-3">
                    <SharedSpellSummary sharedSpell={sharedSpell} />
                  </div>
                </>
              ) : (
                <>
                  {!hydrated && <EffectsSkeleton />}
                  <div className={cn(
                    'transition-opacity duration-200',
                    hydrated ? 'opacity-100' : 'h-0 overflow-hidden opacity-0',
                  )}>
                    <ActiveSpellEffects
                      expandedEffectId={expandedEffectId}
                      onToggleExpand={(id) =>
                        setExpandedEffectId((prev) => (prev === id ? null : id))
                      }
                    />
                    <div className="mt-3">
                      {addedEffects.length > 0 && <ActiveSpellSummary />}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <footer className="relative mt-16 flex w-full flex-col border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
          <div className="mx-auto max-w-4xl space-y-2 text-center">
            <p>Oblivion Tool Suite © 2025 Scott McDermid</p>
            <p>
              Licensed under the{' '}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.html"
                className="underline hover:text-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                GNU General Public License v3.0
              </a>
              .
            </p>
            <p>
              The Elder Scrolls and Oblivion are trademarks of Bethesda Softworks LLC, a ZeniMax
              Media company.
            </p>
            <p>This site is fan-made and not affiliated with Bethesda.</p>
          </div>
          <a
            href="https://github.com/ScottMcDermid/oblivion-spell-altar"
            className="mt-4 inline-flex items-center gap-2 self-end text-xs uppercase tracking-wide text-gray-400 transition hover:text-gray-200 sm:absolute sm:bottom-4 sm:right-6 sm:mt-0"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the project on GitHub"
          >
            <GitHubIcon fontSize="small" />
            <span>GitHub</span>
          </a>
        </footer>

        {!isViewOnly && (
          <>
            <CharacterSkillsDrawer
              open={isCharacterSkillsOpen}
              onClose={() => setIsCharacterSkillsOpen(false)}
            />
            <ConfirmDialog
              open={isConfirmingReset}
              description="This will delete all spell effects"
              handleClose={handleReset}
            />
          </>
        )}

        <Snackbar
          open={snackbarMessage !== null}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
