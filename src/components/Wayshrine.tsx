'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { ArrowBack, Close, FilterList, RestartAlt } from '@mui/icons-material';
import theme from '@/app/theme';
import { useLocationStore } from '@/data/locationStore';
import { useHydrated } from '@/hooks/useHydrated';
import { locationDefinitions } from '@/data/locations';
import { LocationDefinition, LocationStatus, LocationType } from '@/utils/locationTypes';
import LocationList from '@/components/LocationList';
import LocationDetail from '@/components/LocationDetail';
import LocationFilters from '@/components/LocationFilters';
import ConfirmDialog from '@/components/ConfirmDialog';

function WayshrineContent() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const hydrated = useHydrated();

  const locations = useLocationStore((s) => s.locations);
  const completedQuests = useLocationStore((s) => s.completedQuests);
  const investedMerchants = useLocationStore((s) => s.investedMerchants);
  const acquiredItems = useLocationStore((s) => s.acquiredItems);
  const typeFilters = useLocationStore((s) => s.typeFilters);
  const statusFilters = useLocationStore((s) => s.statusFilters);
  const {
    setLocationStatus,
    toggleQuestCompleted,
    toggleMerchantInvested,
    toggleItemAcquired,
    toggleTypeFilter,
    toggleStatusFilter,
    clearFilters,
    resetToDefaults,
  } = useLocationStore((s) => s.actions);

  const activeFilters = useMemo(() => new Set<LocationType>(typeFilters), [typeFilters]);
  const activeStatusFilters = useMemo(() => new Set<LocationStatus>(statusFilters), [statusFilters]);

  const [selectedLocation, setSelectedLocation] = useState<LocationDefinition | null>(null);
  const [search, setSearch] = useState('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const hasActiveFilters = activeFilters.size > 0 || activeStatusFilters.size > 0;

  const filteredLocations = useMemo(
    () =>
      locationDefinitions.filter((loc) => {
        const matchesFilter = activeFilters.size === 0 || activeFilters.has(loc.type);
        const status = locations[loc.id] || 'undiscovered';
        const matchesStatus = activeStatusFilters.size === 0 || activeStatusFilters.has(status);
        return matchesFilter && matchesStatus;
      }),
    [locations, activeFilters, activeStatusFilters],
  );

  const stats = useMemo(() => {
    const total = locationDefinitions.length;
    let discovered = 0;
    let cleared = 0;
    for (const loc of locationDefinitions) {
      const status = locations[loc.id];
      if (status === 'discovered') discovered++;
      if (status === 'cleared') {
        discovered++;
        cleared++;
      }
    }
    return { total, discovered, cleared };
  }, [locations]);

  const handleSelectLocation = (location: LocationDefinition) => {
    setSelectedLocation(location);
    if (isMobile) {
      setMobileDetailOpen(true);
    }
  };

  const handleResetConfirm = (confirm: boolean) => {
    setIsConfirmingReset(false);
    if (confirm) {
      resetToDefaults();
      setSelectedLocation(null);
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
        <CircularProgress sx={{ color: 'secondary.main' }} />
      </Box>
    );
  }

  const detailContent = selectedLocation ? (
    <LocationDetail
      location={selectedLocation}
      status={locations[selectedLocation.id] || 'undiscovered'}
      onStatusChange={(status) => setLocationStatus(selectedLocation.id, status)}
      completedQuests={completedQuests}
      investedMerchants={investedMerchants}
      acquiredItems={acquiredItems}
      onToggleQuest={(name) => toggleQuestCompleted(selectedLocation.id, name)}
      onToggleMerchant={(name) => toggleMerchantInvested(selectedLocation.id, name)}
      onToggleItem={(name) => toggleItemAcquired(selectedLocation.id, name)}
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
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'background.paper' }} elevation={1}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: 'secondary.main',
              flexShrink: 0,
            }}
          >
            Oblivion Wayshrine
          </Typography>

          <IconButton
            size="small"
            onClick={() => setFilterPanelOpen((prev) => !prev)}
            sx={{ color: 'text.secondary' }}
          >
            <Badge variant="dot" color="secondary" invisible={!hasActiveFilters}>
              <FilterList fontSize="small" />
            </Badge>
          </IconButton>

          <Box sx={{ flex: 1 }} />

          <Chip
            label={`${stats.discovered}/${stats.total}`}
            size="small"
            icon={<span style={{ fontSize: '0.7rem', marginLeft: 8 }}>Discovered</span>}
            sx={{
              fontSize: '0.7rem',
              color: '#3b82f6',
              borderColor: '#3b82f6',
              '& .MuiChip-icon': { color: '#93c5fd' },
            }}
            variant="outlined"
          />
          <Chip
            label={`${stats.cleared}/${stats.total}`}
            size="small"
            icon={<span style={{ fontSize: '0.7rem', marginLeft: 8 }}>Cleared</span>}
            sx={{
              fontSize: '0.7rem',
              color: '#22c55e',
              borderColor: '#22c55e',
              '& .MuiChip-icon': { color: '#86efac' },
            }}
            variant="outlined"
          />

          <Button
            size="small"
            startIcon={<RestartAlt sx={{ fontSize: 16 }} />}
            onClick={() => setIsConfirmingReset(true)}
            sx={{
              color: 'error.main',
              fontSize: '0.7rem',
              textTransform: 'none',
              minWidth: 'auto',
            }}
          >
            Reset
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Filter Panel - Desktop */}
        {!isMobile && filterPanelOpen && (
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
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>
              Filters
            </Typography>
            <LocationFilters
              activeFilters={activeFilters}
              onToggleFilter={toggleTypeFilter}
              activeStatusFilters={activeStatusFilters}
              onToggleStatusFilter={toggleStatusFilter}
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
            onClose={() => setMobileDetailOpen(false)}
            PaperProps={{
              sx: {
                width: '100%',
                backgroundColor: 'background.default',
              },
            }}
          >
            <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <IconButton onClick={() => setMobileDetailOpen(false)} size="small">
                <ArrowBack />
              </IconButton>
            </Box>
            {detailContent}
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
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Filters
            </Typography>
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
      <Box
        sx={{
          px: 2,
          py: 0.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
          Not affiliated with Bethesda Softworks. Game data is from UESP.{' '}
          <a
            href="https://github.com/ScottMcDermid/oblivion-wayshrine"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#facc15' }}
          >
            Source
          </a>
        </Typography>
      </Box>

      <ConfirmDialog
        open={isConfirmingReset}
        description="This will reset all locations to their default state. Cities will be marked as discovered, and all other locations will be marked as undiscovered."
        handleClose={handleResetConfirm}
      />
    </Box>
  );
}

export default function Wayshrine() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <WayshrineContent />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
