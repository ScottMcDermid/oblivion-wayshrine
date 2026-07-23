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
import { LocationDLC, LocationDefinition, LocationStatus, locationDLCColors, locationDLCLabels, vanillaLeveledOverrides } from '@/utils/locationTypes';
import { locationTypeIcons } from '@/utils/locationIcons';
import SkillIcon from '@/components/SkillIcon';
import { buildUespUrl, disambiguationNames } from '@/utils/uespLinks';

function UespLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      sx={{
        color: 'inherit',
        textDecoration: 'inherit',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {children}
    </Box>
  );
}

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
  purchasedHorses,
  collectedNirnroots,
  spokenBeggars,
  onToggleQuest,
  onToggleSkillBook,
  onToggleMerchant,
  onToggleItem,
  onTogglePower,
  onToggleHouse,
  onToggleHorse,
  onToggleNirnroot,
  onToggleBeggar,
  unofficialPatch,
  activeDLCFilters,
  completionScope,
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
  purchasedHorses: Record<string, boolean>;
  collectedNirnroots: Record<string, boolean>;
  spokenBeggars: Record<string, boolean>;
  onToggleQuest: (questName: string) => void;
  onToggleSkillBook: (bookTitle: string) => void;
  onToggleMerchant: (merchantName: string) => void;
  onToggleItem: (itemName: string) => void;
  onTogglePower: (powerName: string) => void;
  onToggleHouse: (houseName: string) => void;
  onToggleHorse: (horseName: string) => void;
  onToggleNirnroot: (description: string) => void;
  onToggleBeggar: (beggarName: string) => void;
  unofficialPatch: boolean;
  activeDLCFilters?: Set<LocationDLC>;
  completionScope?: Set<LocationDLC>;
}) {
  const locationDLC = location.dlc ?? 'Base';

  // A quest is visible if it passes both the sidebar DLC filter and the completion scope
  const filteredQuests = location.quests?.filter((q) => {
    const questDLC = q.dlc ?? locationDLC;
    const passesFilter = !activeDLCFilters || activeDLCFilters.size === 0 || activeDLCFilters.has(questDLC);
    const passesScope = !completionScope || completionScope.size === 0 || completionScope.has(questDLC);
    return passesFilter && passesScope;
  });

  // Trainers are scoped to their location's DLC — hide when that DLC is out of scope
  const showTrainers = !completionScope || completionScope.size === 0 || completionScope.has(locationDLC);

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
        <Typography
          variant="h6"
          component="a"
          href={buildUespUrl(location.name, location.dlc, disambiguationNames.has(location.name) ? 'place' : undefined)}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 0.5,
            display: 'block',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(house.name, location.dlc)}>
                          {house.name}
                        </UespLink>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={`${house.price.toLocaleString()} gold`}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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

      {location.horses && location.horses.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Horses
          </Typography>
          <List dense disablePadding>
            {location.horses.map((horse) => {
              const checked = !!purchasedHorses[horse.name];
              return (
                <ListItem
                  key={horse.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleHorse(horse.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#38bdf8',
                        '&.Mui-checked': { color: '#38bdf8' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(horse.name, location.dlc)}>
                          {horse.name}
                        </UespLink>
                      </Box>
                    }
                    secondary={horse.price === 0 ? 'Quest Reward' : `${horse.price.toLocaleString()} gold`}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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

      {filteredQuests && filteredQuests.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Quests
          </Typography>
          <List dense disablePadding>
            {filteredQuests.map((q) => {
              const checked = !!completedQuests[q.name];
              const effectiveQuestDLC = q.dlc ?? locationDLC;
              const questDLCBadge = effectiveQuestDLC !== 'Base' ? effectiveQuestDLC : undefined;
              const secondaryParts: string[] = [];
              if (q.levelReq) {
                secondaryParts.push(`Requires level ${q.levelReq}`);
              }
              if (q.leveled) {
                const effectiveLevel = (!unofficialPatch && vanillaLeveledOverrides[q.name] !== undefined)
                  ? vanillaLeveledOverrides[q.name]
                  : q.leveled;
                secondaryParts.push(`Leveled reward (level ${effectiveLevel}+)`);
              }
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(q.name, q.dlc ?? location.dlc, disambiguationNames.has(q.name) ? 'quest' : undefined)}>
                          {q.name}
                        </UespLink>
                        {questDLCBadge && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[questDLCBadge], lineHeight: 1 }}
                          >
                            {questDLCBadge}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={secondaryParts.length > 0 ? secondaryParts.join(' · ') : undefined}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.disabled' }
                        : { color: '#fb923c' },
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(sb.title, location.dlc)}>
                          {sb.title}
                        </UespLink>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                        <SkillIcon skill={sb.skill} size={12} />
                        {sb.skill}
                      </Box>
                    }
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
                      sx: checked
                        ? { textDecoration: 'line-through', color: 'text.secondary' }
                        : undefined,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.7rem',
                      component: 'div',
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
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
            Invest 500 gold with each merchant to permanently increase their available gold
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(m.name, location.dlc)}>
                          {m.name}
                        </UespLink>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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

      {showTrainers && location.trainers && location.trainers.length > 0 && (
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
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <UespLink href={buildUespUrl(trainer.name, location.dlc)}>
                        {trainer.name}
                      </UespLink>
                      {locationDLC !== 'Base' && (
                        <Typography
                          component="span"
                          sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                        >
                          {locationDLC}
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <SkillIcon skill={trainer.skill} size={12} />
                      {`${trainer.skill} — ${trainer.tier} (up to ${trainer.maxLevel})`}
                    </Box>
                  }
                  primaryTypographyProps={{ fontSize: '0.8rem', component: 'div' }}
                  secondaryTypographyProps={{
                    fontSize: '0.7rem',
                    component: 'div',
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

      {location.beggars && location.beggars.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Beggars
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
            Speak to all 19 beggars in Cyrodiil to unlock Speechcraft master training from Tandilwe (Imperial City)
          </Typography>
          <List dense disablePadding>
            {location.beggars.map((beggar) => {
              const checked = !!spokenBeggars[`${location.id}:${beggar.name}`];
              return (
                <ListItem
                  key={beggar.name}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleBeggar(beggar.name)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#fb923c',
                        '&.Mui-checked': { color: '#fb923c' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <UespLink href={buildUespUrl(beggar.name, location.dlc)}>
                        {beggar.name}
                      </UespLink>
                    }
                    secondary={beggar.location}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(item.name, location.dlc)}>
                          {item.name}
                        </UespLink>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <UespLink href={buildUespUrl(power.name, location.dlc)}>
                          {power.name}
                        </UespLink>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={power.renown > 0 ? `Renown: ${power.renown}` : undefined}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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

      {location.nirnroots && location.nirnroots.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}
          >
            Nirnroots
          </Typography>
          <List dense disablePadding>
            {location.nirnroots.map((nr, idx) => {
              const checked = !!collectedNirnroots[`${location.id}:${nr.description}`];
              return (
                <ListItem
                  key={`${nr.description}-${idx}`}
                  disableGutters
                  sx={{ py: 0.25, cursor: 'pointer' }}
                  onClick={() => onToggleNirnroot(nr.description)}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <Checkbox
                      size="small"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      sx={{
                        p: 0,
                        color: '#84cc16',
                        '&.Mui-checked': { color: '#84cc16' },
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <span>Nirnroot</span>
                        {locationDLC !== 'Base' && (
                          <Typography
                            component="span"
                            sx={{ fontSize: '0.55rem', fontWeight: 'bold', color: locationDLCColors[locationDLC], lineHeight: 1 }}
                          >
                            {locationDLC}
                          </Typography>
                        )}
                      </Box>
                    }
                    secondary={nr.description}
                    primaryTypographyProps={{
                      fontSize: '0.8rem',
                      component: 'div',
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
    </Paper>
  );
}
