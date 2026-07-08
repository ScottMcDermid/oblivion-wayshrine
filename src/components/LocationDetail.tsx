import React from 'react';
import {
  Box,
  Button,
  Checkbox,
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
  RadioButtonUnchecked,
  Warning,
} from '@mui/icons-material';
import { LocationDefinition, LocationStatus, locationDLCColors, locationDLCLabels } from '@/utils/locationTypes';
import { locationTypeIcons } from '@/utils/locationIcons';

export default function LocationDetail({
  location,
  status,
  onStatusChange,
  completedQuests,
  foundSkillBooks,
  investedMerchants,
  acquiredItems,
  acquiredPowers,
  purchasedHouses,
  onToggleQuest,
  onToggleSkillBook,
  onToggleMerchant,
  onToggleItem,
  onTogglePower,
  onToggleHouse,
}: {
  location: LocationDefinition;
  status: LocationStatus;
  onStatusChange: (status: LocationStatus) => void;
  completedQuests: Record<string, boolean>;
  foundSkillBooks: Record<string, boolean>;
  investedMerchants: Record<string, boolean>;
  acquiredItems: Record<string, boolean>;
  acquiredPowers: Record<string, boolean>;
  purchasedHouses: Record<string, boolean>;
  onToggleQuest: (questName: string) => void;
  onToggleSkillBook: (bookTitle: string) => void;
  onToggleMerchant: (merchantName: string) => void;
  onToggleItem: (itemName: string) => void;
  onTogglePower: (powerName: string) => void;
  onToggleHouse: (houseName: string) => void;
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
          <Chip
            icon={React.createElement(locationTypeIcons[location.type], { size: 14 })}
            label={location.type}
            size="small"
            sx={{ fontSize: '0.7rem', '& .MuiChip-icon': { ml: 0.5 } }}
          />
          {location.dlc && (
            <Chip
              label={locationDLCLabels[location.dlc]}
              size="small"
              sx={{
                fontSize: '0.65rem',
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: locationDLCColors[location.dlc],
                height: 20,
              }}
            />
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {location.hold}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button
          size="small"
          fullWidth
          startIcon={
            status === 'cleared' ? <CheckCircle fontSize="small" /> :
            status === 'discovered' ? <Visibility fontSize="small" /> :
            <RadioButtonUnchecked fontSize="small" />
          }
          variant={status === 'undiscovered' ? 'outlined' : 'contained'}
          onClick={() => {
            const next: Record<LocationStatus, LocationStatus> = {
              undiscovered: 'discovered',
              discovered: 'cleared',
              cleared: 'undiscovered',
            };
            onStatusChange(next[status]);
          }}
          sx={{
            backgroundColor:
              status === 'cleared' ? '#22c55e' :
              status === 'discovered' ? '#3b82f6' :
              'transparent',
            borderColor:
              status === 'cleared' ? '#22c55e' :
              status === 'discovered' ? '#3b82f6' :
              'grey.500',
            color:
              status === 'undiscovered' ? 'grey.500' : '#fff',
            '&:hover': {
              backgroundColor:
                status === 'cleared' ? '#22c55e' :
                status === 'discovered' ? '#3b82f6' :
                'rgba(255,255,255,0.05)',
              borderColor:
                status === 'cleared' ? '#22c55e' :
                status === 'discovered' ? '#3b82f6' :
                'grey.500',
            },
            fontSize: '0.7rem',
            textTransform: 'none',
          }}
        >
          {status === 'cleared' ? 'Cleared' :
           status === 'discovered' ? 'Discovered' :
           'Undiscovered'}
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

      {location.houses && location.houses.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Houses
          </Typography>
          <List dense disablePadding>
            {location.houses.map((house) => {
              const checked = !!purchasedHouses[`${location.id}:${house.name}`];
              return (
                <ListItem
                  key={house.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleHouse(house.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#14b8a6',
                        '&.Mui-checked': { color: '#14b8a6' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={house.name}
                    secondary={`${house.price.toLocaleString()} gold`}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.disabled' }
                        : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
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
            {location.quests.map((q) => {
              const checked = !!completedQuests[`${location.id}:${q.name}`];
              return (
                <ListItem
                  key={q.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleQuest(q.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#a78bfa',
                        '&.Mui-checked': { color: '#a78bfa' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={q.name}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
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
            {location.skillBooks.map((sb) => {
              const checked = !!foundSkillBooks[`${location.id}:${sb.title}`];
              return (
                <ListItem
                  key={sb.title}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleSkillBook(sb.title)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#60a5fa',
                        '&.Mui-checked': { color: '#60a5fa' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={sb.title}
                    secondary={sb.skill}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.disabled' }
                        : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
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
            {location.merchants.map((m) => {
              const checked = !!investedMerchants[`${location.id}:${m.name}`];
              return (
                <ListItem
                  key={m.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleMerchant(m.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#34d399',
                        '&.Mui-checked': { color: '#34d399' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={m.name}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      {location.trainers && location.trainers.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Trainers
          </Typography>
          <List dense disablePadding>
            {[...location.trainers].sort((a, b) => {
              const tierOrder = { Master: 0, Journeyman: 1, Novice: 2 };
              const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
              return tierDiff !== 0 ? tierDiff : a.name.localeCompare(b.name);
            }).map((trainer) => (
              <ListItem
                key={`${trainer.name}-${trainer.skill}`}
                disableGutters
                sx={{ py: 0.25 }}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor:
                        trainer.tier === 'Master' ? '#ef4444' :
                        trainer.tier === 'Journeyman' ? '#3b82f6' :
                        '#22c55e',
                      ml: 0.75,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={trainer.name}
                  secondary={`${trainer.skill} — ${trainer.tier} (up to ${trainer.maxLevel})`}
                  primaryTypographyProps={{ fontSize: '0.8rem' }}
                  secondaryTypographyProps={{
                    fontSize: '0.7rem',
                    sx: {
                      color:
                        trainer.tier === 'Master' ? '#ef4444' :
                        trainer.tier === 'Journeyman' ? '#3b82f6' :
                        '#22c55e',
                    },
                  }}
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
            {location.uniqueItems.map((item) => {
              const checked = !!acquiredItems[`${location.id}:${item.name}`];
              return (
                <ListItem
                  key={item.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleItem(item.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#f472b6',
                        '&.Mui-checked': { color: '#f472b6' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      {location.greaterPowers && location.greaterPowers.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Greater Powers
          </Typography>
          <List dense disablePadding>
            {location.greaterPowers.map((power) => {
              const checked = !!acquiredPowers[`${location.id}:${power.name}`];
              return (
                <ListItem
                  key={power.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onTogglePower(power.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#f59e0b',
                        '&.Mui-checked': { color: '#f59e0b' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={power.name}
                    secondary={power.renown > 0 ? `Renown: ${power.renown}` : undefined}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.disabled' }
                        : { color: '#f59e0b' },
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Paper>
  );
}
