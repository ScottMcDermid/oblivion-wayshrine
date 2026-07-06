import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  MenuBook,
  Store,
  Assignment,
  Diamond,
  Warning,
} from '@mui/icons-material';
import { LocationDefinition, LocationStatus } from '@/utils/locationTypes';

export default function LocationDetail({
  location,
  status,
  onStatusChange,
}: {
  location: LocationDefinition;
  status: LocationStatus;
  onStatusChange: (status: LocationStatus) => void;
}) {

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
          {location.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip label={location.type} size="small" sx={{ fontSize: '0.7rem' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {location.hold}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <Button
          size="small"
          startIcon={<Visibility fontSize="small" />}
          variant={status === 'discovered' ? 'contained' : 'outlined'}
          onClick={() => onStatusChange(status === 'discovered' ? 'undiscovered' : 'discovered')}
          sx={{
            flex: 1,
            backgroundColor: status === 'discovered' ? '#3b82f6' : 'transparent',
            borderColor: '#3b82f6',
            color: status === 'discovered' ? '#fff' : '#3b82f6',
            '&:hover': {
              backgroundColor: status === 'discovered' ? '#3b82f6' : '#3b82f622',
              borderColor: '#3b82f6',
            },
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          Discovered
        </Button>
        <Button
          size="small"
          startIcon={<CheckCircle fontSize="small" />}
          variant={status === 'cleared' ? 'contained' : 'outlined'}
          onClick={() => onStatusChange(status === 'cleared' ? 'undiscovered' : 'cleared')}
          sx={{
            flex: 1,
            backgroundColor: status === 'cleared' ? '#22c55e' : 'transparent',
            borderColor: '#22c55e',
            color: status === 'cleared' ? '#fff' : '#22c55e',
            '&:hover': {
              backgroundColor: status === 'cleared' ? '#22c55e' : '#22c55e22',
              borderColor: '#22c55e',
            },
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          Cleared
        </Button>
      </Box>

      {location.notes && (
        <Box
          sx={{
            mb: 2,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: '#78350f33',
            border: '1px solid #b45309',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Warning sx={{ fontSize: 16, color: '#fbbf24' }} />
            <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 'bold' }}>
              Note
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#fde68a', fontSize: '0.8rem' }}>
            {location.notes}
          </Typography>
        </Box>
      )}

      {location.quests && location.quests.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Quests
          </Typography>
          <List dense disablePadding>
            {location.quests.map((q) => (
              <ListItem key={q.name} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Assignment sx={{ fontSize: 16, color: '#a78bfa' }} />
                </ListItemIcon>
                <ListItemText
                  primary={q.name}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {location.skillBooks && location.skillBooks.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Skill Books
          </Typography>
          <List dense disablePadding>
            {location.skillBooks.map((sb) => (
              <ListItem key={sb.title} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <MenuBook sx={{ fontSize: 16, color: '#60a5fa' }} />
                </ListItemIcon>
                <ListItemText
                  primary={sb.title}
                  secondary={sb.skill}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                  secondaryTypographyProps={{ fontSize: '0.7rem' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {location.merchants && location.merchants.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Merchants
          </Typography>
          <List dense disablePadding>
            {location.merchants.map((m) => (
              <ListItem key={m.name} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Store sx={{ fontSize: 16, color: '#34d399' }} />
                </ListItemIcon>
                <ListItemText
                  primary={m.name}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}

      {location.uniqueItems && location.uniqueItems.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Unique Items
          </Typography>
          <List dense disablePadding>
            {location.uniqueItems.map((item) => (
              <ListItem key={item.name} disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Diamond sx={{ fontSize: 16, color: '#f472b6' }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
}
