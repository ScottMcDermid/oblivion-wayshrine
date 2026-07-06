import React from 'react';
import { Chip, Stack } from '@mui/material';
import { LocationType, locationTypes } from '@/utils/locationTypes';

export default function LocationFilters({
  activeFilters,
  onToggleFilter,
}: {
  activeFilters: Set<LocationType>;
  onToggleFilter: (type: LocationType) => void;
}) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
      {locationTypes.map((type) => (
        <Chip
          key={type}
          label={type}
          size="small"
          variant={activeFilters.has(type) ? 'filled' : 'outlined'}
          onClick={() => onToggleFilter(type)}
          sx={{
            borderColor: activeFilters.has(type) ? 'secondary.main' : 'divider',
            color: activeFilters.has(type) ? '#1e1e1e' : 'text.primary',
            backgroundColor: activeFilters.has(type) ? 'secondary.main' : 'transparent',
            '&:hover': {
              backgroundColor: activeFilters.has(type) ? 'secondary.dark' : 'action.hover',
            },
            fontSize: '0.7rem',
          }}
        />
      ))}
    </Stack>
  );
}
