import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  LocationStatus,
  LocationType,
  locationStatuses,
  locationTypes,
} from '@/utils/locationTypes';
import { locationTypeIcons } from '@/utils/locationIcons';

const statusColors: Record<LocationStatus, string> = {
  undiscovered: '#9e9e9e',
  discovered: '#3b82f6',
  cleared: '#22c55e',
};

const statusLabels: Record<LocationStatus, string> = {
  undiscovered: 'Undiscovered',
  discovered: 'Discovered',
  cleared: 'Cleared',
};

export default function LocationFilters({
  activeFilters,
  onToggleFilter,
  activeStatusFilters,
  onToggleStatusFilter,
}: {
  activeFilters: Set<LocationType>;
  onToggleFilter: (type: LocationType) => void;
  activeStatusFilters: Set<LocationStatus>;
  onToggleStatusFilter: (status: LocationStatus) => void;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 0.5, display: 'block' }}
        >
          Status
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {locationStatuses.map((status) => {
            const active = activeStatusFilters.has(status);
            const color = statusColors[status];
            return (
              <Chip
                key={status}
                label={statusLabels[status]}
                size="small"
                variant={active ? 'filled' : 'outlined'}
                onClick={() => onToggleStatusFilter(status)}
                sx={{
                  borderColor: active ? color : 'divider',
                  color: active ? '#fff' : 'text.primary',
                  backgroundColor: active ? color : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? color : 'action.hover',
                  },
                  fontSize: '0.7rem',
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', mb: 0.5, display: 'block' }}
        >
          Type
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
          {locationTypes.map((type) => (
            <Chip
              key={type}
              icon={React.createElement(locationTypeIcons[type], { size: 14 })}
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
                '& .MuiChip-icon': {
                  color: activeFilters.has(type) ? '#1e1e1e' : 'text.secondary',
                  ml: 0.5,
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
