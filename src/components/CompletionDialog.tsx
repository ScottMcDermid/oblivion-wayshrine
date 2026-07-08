import React from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type CompletionCategory = {
  label: string;
  completed: number;
  total: number;
  color: string;
};

function CategoryRow({ label, completed, total, color }: CompletionCategory) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.primary' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          {completed} / {total}
          <Typography
            component="span"
            sx={{ fontSize: '0.75rem', color, fontWeight: 'bold', ml: 1 }}
          >
            {percent}%
          </Typography>
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{
          height: 6,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.08)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: color,
          },
        }}
      />
    </Box>
  );
}

export default function CompletionDialog({
  open,
  onClose,
  totals,
  completed,
}: {
  open: boolean;
  onClose: () => void;
  totals: {
    locations: number;
    quests: number;
    skillBooks: number;
    merchants: number;
    uniqueItems: number;
    houses: number;
    greaterPowers: number;
  };
  completed: {
    locations: number;
    quests: number;
    skillBooks: number;
    merchants: number;
    uniqueItems: number;
    houses: number;
    greaterPowers: number;
  };
}) {
  const categories: CompletionCategory[] = [
    { label: 'Locations Cleared', completed: completed.locations, total: totals.locations, color: '#22c55e' },
    { label: 'Quests Completed', completed: completed.quests, total: totals.quests, color: '#a78bfa' },
    { label: 'Skill Books Found', completed: completed.skillBooks, total: totals.skillBooks, color: '#60a5fa' },
    { label: 'Merchants Invested', completed: completed.merchants, total: totals.merchants, color: '#34d399' },
    { label: 'Unique Items Acquired', completed: completed.uniqueItems, total: totals.uniqueItems, color: '#f472b6' },
    { label: 'Houses Purchased', completed: completed.houses, total: totals.houses, color: '#14b8a6' },
    { label: 'Greater Powers Acquired', completed: completed.greaterPowers, total: totals.greaterPowers, color: '#f59e0b' },
  ];

  const percentages = categories.map((cat) =>
    cat.total > 0 ? (cat.completed / cat.total) * 100 : 100,
  );
  const overallPercent = Math.round(
    percentages.reduce((a, b) => a + b, 0) / categories.length,
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Completion Progress</span>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'text.primary' }}>
              Overall
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'secondary.main' }}>
              {overallPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 'secondary.main',
              },
            }}
          />
        </Box>

        {categories.map((cat) => (
          <CategoryRow key={cat.label} {...cat} />
        ))}
      </DialogContent>
    </Dialog>
  );
}
