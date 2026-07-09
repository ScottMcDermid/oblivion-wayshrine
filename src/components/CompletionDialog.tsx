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

const RADIUS = 80;
const CX = 100;
const CY = 100;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEGREES = 2; // small gap between segments in degrees

function MultiArcCircle({
  categories,
  overallPercent,
}: {
  categories: CompletionCategory[];
  overallPercent: number;
}) {
  const sumTotal = categories.reduce((acc, cat) => acc + (cat.total > 0 ? cat.total : 1), 0);
  const gapCount = categories.length;
  const totalGapDegrees = GAP_DEGREES * gapCount;
  const availableDegrees = 360 - totalGapDegrees;

  let cursor = -90; // start from the top

  const segments = categories.map((cat) => {
    const effectiveTotal = cat.total > 0 ? cat.total : 1;
    const segmentDegrees = (effectiveTotal / sumTotal) * availableDegrees;
    const segmentLength = (segmentDegrees / 360) * CIRCUMFERENCE;
    const completionRatio = cat.total > 0 ? cat.completed / cat.total : 1;
    const filledLength = segmentLength * completionRatio;
    const startAngle = cursor;

    cursor += segmentDegrees + GAP_DEGREES;

    return {
      color: cat.color,
      label: cat.label,
      startAngle,
      segmentLength,
      filledLength,
    };
  });

  return (
    <Box sx={{ position: 'relative', width: 240, height: 240, mx: 'auto', mb: 3 }}>
      <svg viewBox="0 0 200 200" width="240" height="240">
        {/* Background track ring */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={14}
        />

        {/* Dim unfilled segment outlines — rendered first (below filled arcs) */}
        {segments.map((seg) => (
          <circle
            key={`track-${seg.label}`}
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeLinecap="butt"
            strokeDasharray={`${seg.segmentLength} ${CIRCUMFERENCE}`}
            strokeOpacity={0.15}
            transform={`rotate(${seg.startAngle}, ${CX}, ${CY})`}
          />
        ))}

        {/* Filled arcs — rendered on top */}
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeLinecap="butt"
            strokeDasharray={`${seg.filledLength} ${CIRCUMFERENCE}`}
            transform={`rotate(${seg.startAngle}, ${CX}, ${CY})`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        ))}
      </svg>

      {/* Center label */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'secondary.main',
            lineHeight: 1,
          }}
        >
          {overallPercent}%
        </Typography>
        <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          overall
        </Typography>
      </Box>
    </Box>
  );
}

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
    nirnroots: number;
  };
  completed: {
    locations: number;
    quests: number;
    skillBooks: number;
    merchants: number;
    uniqueItems: number;
    houses: number;
    greaterPowers: number;
    nirnroots: number;
  };
}) {
  const categories: CompletionCategory[] = [
    { label: 'Locations Cleared',      completed: completed.locations,     total: totals.locations,     color: '#22c55e' },
    { label: 'Quests Completed',        completed: completed.quests,        total: totals.quests,        color: '#a78bfa' },
    { label: 'Skill Books Found',       completed: completed.skillBooks,    total: totals.skillBooks,    color: '#60a5fa' },
    { label: 'Merchants Invested',      completed: completed.merchants,     total: totals.merchants,     color: '#34d399' },
    { label: 'Unique Items Acquired',   completed: completed.uniqueItems,   total: totals.uniqueItems,   color: '#f472b6' },
    { label: 'Houses Purchased',        completed: completed.houses,        total: totals.houses,        color: '#14b8a6' },
    { label: 'Greater Powers Acquired', completed: completed.greaterPowers, total: totals.greaterPowers, color: '#f59e0b' },
    { label: 'Nirnroots Collected',     completed: completed.nirnroots,     total: totals.nirnroots,     color: '#84cc16' },
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
        <MultiArcCircle categories={categories} overallPercent={overallPercent} />

        {categories.map((cat) => (
          <CategoryRow key={cat.label} {...cat} />
        ))}
      </DialogContent>
    </Dialog>
  );
}
