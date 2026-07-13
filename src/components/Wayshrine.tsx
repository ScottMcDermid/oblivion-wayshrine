'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ThemeProvider, StyledEngineProvider, useTheme } from '@mui/material/styles';
import { ArrowBack, Close } from '@mui/icons-material';
import theme from '@/app/theme';
import { useLocationStore } from '@/data/locationStore';
import { useHydrated } from '@/hooks/useHydrated';
import { locationDefinitions, locationDefinitionById } from '@/data/locations';
import { LocationDLC, LocationDefinition, LocationStatus, LocationType } from '@/utils/locationTypes';
import LocationList from '@/components/LocationList';
import LocationDetail from '@/components/LocationDetail';
import LocationFilters from '@/components/LocationFilters';
import ConfirmDialog from '@/components/ConfirmDialog';
import CompletionDialog from '@/components/CompletionDialog';

function WayshrineContent({ locationId }: { locationId?: string }) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const hydrated = useHydrated();

  const locations = useLocationStore((s) => s.locations);
  const completedQuests = useLocationStore((s) => s.completedQuests);
  const foundSkillBooks = useLocationStore((s) => s.foundSkillBooks);
  const investedMerchants = useLocationStore((s) => s.investedMerchants);
  const acquiredItems = useLocationStore((s) => s.acquiredItems);
  const acquiredPowers = useLocationStore((s) => s.acquiredPowers);
  const purchasedHouses = useLocationStore((s) => s.purchasedHouses);
  const collectedNirnroots = useLocationStore((s) => s.collectedNirnroots);
  const typeFilters = useLocationStore((s) => s.typeFilters);
  const statusFilters = useLocationStore((s) => s.statusFilters);
  const dlcFilters = useLocationStore((s) => s.dlcFilters);
  const completionScope = useLocationStore((s) => s.completionScope);
  const {
    setLocationStatus,
    toggleQuestCompleted,
    toggleSkillBookFound,
    toggleMerchantInvested,
    toggleItemAcquired,
    togglePowerAcquired,
    toggleHousePurchased,
    toggleNirnrootCollected,
    toggleTypeFilter,
    toggleStatusFilter,
    toggleDLCFilter,
    toggleCompletionScope,
    clearFilters,
    resetToDefaults,
  } = useLocationStore((s) => s.actions);

  const activeFilters = useMemo(() => new Set<LocationType>(typeFilters), [typeFilters]);
  const activeStatusFilters = useMemo(() => new Set<LocationStatus>(statusFilters), [statusFilters]);
  const activeDLCFilters = useMemo(() => new Set<LocationDLC>(dlcFilters), [dlcFilters]);
  const activeCompletionScope = useMemo(() => new Set<LocationDLC>(completionScope), [completionScope]);

  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(locationId);

  const selectedLocation = useMemo(
    () => (selectedLocationId ? locationDefinitionById[selectedLocationId] ?? null : null),
    [selectedLocationId],
  );

  const displayedLocationRef = useRef<LocationDefinition | null>(null);
  if (selectedLocation) {
    displayedLocationRef.current = selectedLocation;
  }
  const displayedLocation = selectedLocation ?? displayedLocationRef.current;

  const navigateTo = useCallback((id?: string) => {
    const path = id ? `/location/${id}` : '/';
    window.history.pushState(null, '', path);
    setSelectedLocationId(id);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/location\/(.+)$/);
      setSelectedLocationId(match ? match[1] : undefined);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [search, setSearch] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const mobileDetailOpen = isMobile && !!selectedLocation;

  const hasActiveFilters = activeFilters.size > 0 || activeStatusFilters.size > 0 || activeDLCFilters.size > 0;

  const filteredLocations = useMemo(
    () =>
      locationDefinitions.filter((loc) => {
        const matchesFilter = activeFilters.size === 0 || activeFilters.has(loc.type);
        const status = locations[loc.id] || 'undiscovered';
        const matchesStatus = activeStatusFilters.size === 0 || activeStatusFilters.has(status);
        const locDLC = loc.dlc ?? 'Base';
        const hasMatchingQuestDLC = loc.quests?.some((q) => q.dlc && activeDLCFilters.has(q.dlc)) ?? false;
        const matchesDLC = activeDLCFilters.size === 0 || activeDLCFilters.has(locDLC) || hasMatchingQuestDLC;
        const inScope = activeCompletionScope.size === 0 || activeCompletionScope.has(locDLC);
        return matchesFilter && matchesStatus && matchesDLC && inScope;
      }),
    [locations, activeFilters, activeStatusFilters, activeDLCFilters, activeCompletionScope],
  );

  const totals = useMemo(() => {
    const uniqueQuests = new Set<string>();
    let scopedLocations = 0;
    let skillBooks = 0, merchants = 0, uniqueItems = 0, houses = 0, greaterPowers = 0, nirnroots = 0;
    for (const loc of locationDefinitions) {
      const locDLC = loc.dlc ?? 'Base';
      const locInScope = activeCompletionScope.size === 0 || activeCompletionScope.has(locDLC);
      if (locInScope) {
        scopedLocations++;
        // Count only quests whose effective DLC is in scope
        loc.quests?.forEach((q) => {
          const questDLC = q.dlc ?? locDLC;
          if (activeCompletionScope.size === 0 || activeCompletionScope.has(questDLC)) {
            uniqueQuests.add(q.name);
          }
        });
        skillBooks += loc.skillBooks?.length ?? 0;
        merchants += loc.merchants?.length ?? 0;
        uniqueItems += loc.uniqueItems?.length ?? 0;
        houses += loc.houses?.length ?? 0;
        greaterPowers += loc.greaterPowers?.length ?? 0;
        nirnroots += loc.nirnroots?.length ?? 0;
      }
    }
    return { locations: scopedLocations, quests: uniqueQuests.size, skillBooks, merchants, uniqueItems, houses, greaterPowers, nirnroots };
  }, [activeCompletionScope]);

  const completed = useMemo(() => {
    // Build a set of in-scope location IDs and in-scope quest names for fast lookups
    const scopedLocationIds = new Set<string>();
    const scopedQuestNames = new Set<string>();
    for (const loc of locationDefinitions) {
      const locDLC = loc.dlc ?? 'Base';
      if (activeCompletionScope.size === 0 || activeCompletionScope.has(locDLC)) {
        scopedLocationIds.add(loc.id);
        loc.quests?.forEach((q) => {
          const questDLC = q.dlc ?? locDLC;
          if (activeCompletionScope.size === 0 || activeCompletionScope.has(questDLC)) {
            scopedQuestNames.add(q.name);
          }
        });
      }
    }

    return {
      locations: Object.entries(locations).filter(([id, s]) => s === 'cleared' && scopedLocationIds.has(id)).length,
      quests: Object.keys(completedQuests).filter((name) => scopedQuestNames.has(name)).length,
      skillBooks: Object.keys(foundSkillBooks).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
      merchants: Object.keys(investedMerchants).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
      uniqueItems: Object.keys(acquiredItems).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
      houses: Object.keys(purchasedHouses).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
      greaterPowers: Object.keys(acquiredPowers).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
      nirnroots: Object.keys(collectedNirnroots).filter((key) => scopedLocationIds.has(key.split(':')[0])).length,
    };
  }, [activeCompletionScope, locations, completedQuests, foundSkillBooks, investedMerchants, acquiredItems, purchasedHouses, acquiredPowers, collectedNirnroots]);

  const overallPercent = useMemo(() => {
    const cats = ['locations', 'quests', 'skillBooks', 'merchants', 'uniqueItems', 'houses', 'greaterPowers', 'nirnroots'] as const;
    const percentages = cats.map((cat) =>
      totals[cat] > 0 ? (completed[cat] / totals[cat]) * 100 : 100,
    );
    return Math.round(percentages.reduce((a, b) => a + b, 0) / cats.length);
  }, [totals, completed]);

  const handleSelectLocation = (location: LocationDefinition) => {
    navigateTo(location.id);
  };

  const handleResetConfirm = (confirm: boolean) => {
    setIsConfirmingReset(false);
    if (confirm) {
      resetToDefaults();
      navigateTo();
    }
  };

  if (!hydrated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  const detailContent = selectedLocation ? (
    <LocationDetail
      location={selectedLocation}
      status={locations[selectedLocation.id] || 'undiscovered'}
      onStatusChange={(status) => setLocationStatus(selectedLocation.id, status)}
      completedQuests={completedQuests}
      foundSkillBooks={foundSkillBooks}
      investedMerchants={investedMerchants}
      acquiredItems={acquiredItems}
      acquiredPowers={acquiredPowers}
      purchasedHouses={purchasedHouses}
      collectedNirnroots={collectedNirnroots}
      onToggleQuest={(name) => toggleQuestCompleted(name)}
      onToggleSkillBook={(title) => toggleSkillBookFound(selectedLocation.id, title)}
      onToggleMerchant={(name) => toggleMerchantInvested(selectedLocation.id, name)}
      onToggleItem={(name) => toggleItemAcquired(selectedLocation.id, name)}
      onTogglePower={(name) => togglePowerAcquired(selectedLocation.id, name)}
      onToggleHouse={(name) => toggleHousePurchased(selectedLocation.id, name)}
      onToggleNirnroot={(desc) => toggleNirnrootCollected(selectedLocation.id, desc)}
      activeDLCFilters={activeDLCFilters}
      completionScope={activeCompletionScope}
    />
  ) : (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'text.secondary',
      }}
    >
      <Typography variant="body2">Select a location to view details</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxWidth: '100vw',
        overflowX: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'background.paper' }} elevation={1}>
        <Toolbar variant="dense" sx={{ gap: 1, overflow: 'hidden' }}>
          <IconButton
            component="a"
            href="https://oblivion.tools"
            size="small"
            aria-label="Oblivion Tools home"
            sx={{ p: 0.5 }}
          >
            <img src="/oblivion-tools-icon.ico" alt="Oblivion Tools" width={16} height={16} style={{ display: 'block' }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'secondary.main',
            }}
          >
            Oblivion Wayshrine
          </Typography>

          <Box sx={{ flex: 1 }} />

          <Chip
            label={`${overallPercent}%`}
            size="small"
            icon={isMobile ? undefined : <span style={{ fontSize: '0.7rem', marginLeft: 8 }}>Completion</span>}
            onClick={() => setCompletionDialogOpen(true)}
            sx={{
              fontSize: '0.7rem',
              color: 'text.secondary',
              borderColor: 'divider',
              cursor: 'pointer',
              '& .MuiChip-icon': { color: 'text.secondary' },
            }}
            variant="outlined"
          />


        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
        {/* Filter Panel - Desktop */}
        {!isMobile && (
          <Collapse orientation="horizontal" in={filterPanelOpen} timeout={250}>
            <Box
              sx={{
                width: 250,
                minWidth: 250,
                borderRight: '1px solid',
                borderColor: 'divider',
                overflow: 'auto',
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Filters
                </Typography>
                <IconButton size="small" onClick={() => setFilterPanelOpen(false)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              <LocationFilters
                activeFilters={activeFilters}
                onToggleFilter={toggleTypeFilter}
                activeStatusFilters={activeStatusFilters}
                onToggleStatusFilter={toggleStatusFilter}
                activeDLCFilters={activeDLCFilters}
                onToggleDLCFilter={toggleDLCFilter}
              />
              {hasActiveFilters && (
                <Button
                  size="small"
                  onClick={clearFilters}
                  sx={{
                    mt: 1.5,
                    fontSize: '0.7rem',
                    textTransform: 'none',
                    color: 'text.secondary',
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          </Collapse>
        )}

        {/* Location List */}
        <Box
          sx={{
            width: isMobile ? '100%' : 380,
            minWidth: isMobile ? '100%' : 380,
            borderRight: isMobile ? 'none' : '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <LocationList
            filteredLocations={filteredLocations}
            locations={locations}
            selectedId={selectedLocation?.id ?? null}
            onSelect={handleSelectLocation}
            search={search}
            onSearchChange={setSearch}
            onToggleFilter={() => setFilterPanelOpen((prev) => !prev)}
            hasActiveFilters={hasActiveFilters}
          />
        </Box>

        {/* Detail Panel - Desktop */}
        {!isMobile && (
          <Box sx={{ flex: 1, overflow: 'auto' }}>{detailContent}</Box>
        )}

        {/* Detail Drawer - Mobile */}
        {isMobile && (
          <Drawer
            anchor="right"
            open={mobileDetailOpen}
            onClose={() => navigateTo()}
            transitionDuration={{ enter: 250, exit: 200 }}
            PaperProps={{
              sx: {
                width: '100%',
                backgroundColor: 'background.default',
              },
            }}
          >
            <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <IconButton onClick={() => navigateTo()} size="small">
                <ArrowBack />
              </IconButton>
            </Box>
            {displayedLocation ? (
              <LocationDetail
                location={displayedLocation}
                status={locations[displayedLocation.id] || 'undiscovered'}
                onStatusChange={(status) => setLocationStatus(displayedLocation.id, status)}
                completedQuests={completedQuests}
                foundSkillBooks={foundSkillBooks}
                investedMerchants={investedMerchants}
                acquiredItems={acquiredItems}
                acquiredPowers={acquiredPowers}
                purchasedHouses={purchasedHouses}
                collectedNirnroots={collectedNirnroots}
                onToggleQuest={(name) => toggleQuestCompleted(name)}
                onToggleSkillBook={(title) => toggleSkillBookFound(displayedLocation.id, title)}
                onToggleMerchant={(name) => toggleMerchantInvested(displayedLocation.id, name)}
                onToggleItem={(name) => toggleItemAcquired(displayedLocation.id, name)}
                onTogglePower={(name) => togglePowerAcquired(displayedLocation.id, name)}
                onToggleHouse={(name) => toggleHousePurchased(displayedLocation.id, name)}
                onToggleNirnroot={(desc) => toggleNirnrootCollected(displayedLocation.id, desc)}
                activeDLCFilters={activeDLCFilters}
                completionScope={activeCompletionScope}
              />
            ) : null}
          </Drawer>
        )}
      </Box>

      {/* Filter Dialog - Mobile */}
      {isMobile && (
        <Dialog
          open={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
            }}
          >
            <span style={{ fontWeight: 'bold' }}>Filters</span>
            <IconButton size="small" onClick={() => setFilterPanelOpen(false)}>
              <Close fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <LocationFilters
              activeFilters={activeFilters}
              onToggleFilter={toggleTypeFilter}
              activeStatusFilters={activeStatusFilters}
              onToggleStatusFilter={toggleStatusFilter}
              activeDLCFilters={activeDLCFilters}
              onToggleDLCFilter={toggleDLCFilter}
            />
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{
                  mt: 1.5,
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  color: 'text.secondary',
                }}
              >
                Clear filters
              </Button>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Footer */}
      <footer className="mt-16 w-full border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-center sm:text-left">
          <div className="space-y-2">
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
          <div className="flex w-full justify-end">
            <a
              href="https://github.com/ScottMcDermid/oblivion-wayshrine"
              className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1 text-xs font-medium text-gray-400 transition hover:border-gray-600 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current" focusable="false">
                <path d="M12 .297C5.375.297 0 5.67 0 12.297c0 5.302 3.438 9.799 8.205 11.387.6.112.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.203.085 1.836 1.236 1.836 1.236 1.07 1.835 2.808 1.305 3.492.998.108-.775.418-1.305.762-1.606-2.665-.303-5.467-1.334-5.467-5.934 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.628-5.48 5.923.43.37.823 1.096.823 2.21 0 1.595-.015 2.882-.015 3.274 0 .32.22.694.825.576C20.565 22.092 24 17.597 24 12.297 24 5.67 18.627.297 12 .297z" />
              </svg>
              <span className="uppercase tracking-wide">GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      <ConfirmDialog
        open={isConfirmingReset}
        description="This will reset all locations to their default state. Cities will be marked as discovered, and all other locations will be marked as undiscovered."
        handleClose={handleResetConfirm}
      />

      <CompletionDialog
        open={completionDialogOpen}
        onClose={() => setCompletionDialogOpen(false)}
        onReset={() => setIsConfirmingReset(true)}
        totals={totals}
        completed={completed}
        completionScope={completionScope}
        onToggleCompletionScope={toggleCompletionScope}
      />
    </Box>
  );
}

export default function Wayshrine({ locationId }: { locationId?: string }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <WayshrineContent locationId={locationId} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
