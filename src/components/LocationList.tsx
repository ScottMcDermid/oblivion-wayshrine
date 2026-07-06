import React from 'react';
import {
  Box,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import {
  Search,
  Visibility,
  CheckCircle,
} from '@mui/icons-material';
import { LocationDefinition, LocationStatus, LocationType } from '@/utils/locationTypes';
import { locationDefinitions } from '@/data/locations';
import LocationFilters from '@/components/LocationFilters';

const statusIcon: Partial<Record<LocationStatus, React.ReactNode>> = {
  discovered: <Visibility sx={{ fontSize: 14, color: '#3b82f6' }} />,
  cleared: <CheckCircle sx={{ fontSize: 14, color: '#22c55e' }} />,
};

export default function LocationList({
  locations,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  activeFilters,
  onToggleFilter,
}: {
  locations: Record<string, LocationStatus>;
  selectedId: string | null;
  onSelect: (location: LocationDefinition) => void;
  search: string;
  onSearchChange: (search: string) => void;
  activeFilters: Set<LocationType>;
  onToggleFilter: (type: LocationType) => void;
}) {
  const filtered = locationDefinitions.filter((loc) => {
    const matchesSearch =
      search === '' || loc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilters.size === 0 || activeFilters.has(loc.type);
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 1.5, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              fontSize: '0.85rem',
            },
          }}
        />
        <LocationFilters activeFilters={activeFilters} onToggleFilter={onToggleFilter} />
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List dense disablePadding>
          {filtered.map((loc) => {
            const status = locations[loc.id] || 'undiscovered';
            const isSelected = selectedId === loc.id;
            const hasInfo =
              (loc.quests && loc.quests.length > 0) ||
              (loc.skillBooks && loc.skillBooks.length > 0) ||
              (loc.merchants && loc.merchants.length > 0) ||
              (loc.uniqueItems && loc.uniqueItems.length > 0);

            return (
              <ListItemButton
                key={loc.id}
                selected={isSelected}
                onClick={() => onSelect(loc)}
                sx={{
                  py: 0.5,
                  px: 1.5,
                  borderLeft: isSelected ? '3px solid' : '3px solid transparent',
                  borderLeftColor: isSelected ? 'secondary.main' : 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                  },
                }}
              >
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', width: 14 }}>
                  {statusIcon[status] ?? null}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.8rem',
                          color: status === 'undiscovered' ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {loc.name}
                      </Typography>
                      {loc.notes && (
                        <Typography sx={{ fontSize: '0.65rem', color: '#fbbf24' }}>!</Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.65rem', color: 'text.secondary' }}
                    >
                      {loc.type}
                      {hasInfo ? ' \u00B7 Has info' : ''}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
          {filtered.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No locations found
              </Typography>
            </Box>
          )}
        </List>
      </Box>
    </Box>
  );
}
