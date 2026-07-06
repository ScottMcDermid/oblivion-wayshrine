'use client';

import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ThemeProvider, StyledEngineProvider, useTheme } from '@mui/material/styles';
import { ArrowBack, RestartAlt } from '@mui/icons-material';
import theme from '@/app/theme';
import { useLocationStore } from '@/data/locationStore';
import { useHydrated } from '@/hooks/useHydrated';
import { locationDefinitions } from '@/data/locations';
import { LocationDefinition, LocationType } from '@/utils/locationTypes';
import LocationList from '@/components/LocationList';
import LocationDetail from '@/components/LocationDetail';
import ConfirmDialog from '@/components/ConfirmDialog';

function WayshrineContent() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const hydrated = useHydrated();

  const locations = useLocationStore((s) => s.locations);
  const completedQuests = useLocationStore((s) => s.completedQuests);
  const investedMerchants = useLocationStore((s) => s.investedMerchants);
  const acquiredItems = useLocationStore((s) => s.acquiredItems);
  const {
    setLocationStatus,
    toggleQuestCompleted,
    toggleMerchantInvested,
    toggleItemAcquired,
    resetToDefaults,
  } = useLocationStore((s) => s.actions);

  const [selectedLocation, setSelectedLocation] = useState<LocationDefinition | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<LocationType>>(new Set());
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

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

  const handleToggleFilter = (type: LocationType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

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
        {/* Location List - Left Panel */}
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
            locations={locations}
            selectedId={selectedLocation?.id ?? null}
            onSelect={handleSelectLocation}
            search={search}
            onSearchChange={setSearch}
            activeFilters={activeFilters}
            onToggleFilter={handleToggleFilter}
          />
        </Box>

        {/* Detail Panel - Right (desktop only) */}
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
