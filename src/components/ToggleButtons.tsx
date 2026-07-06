import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons({
  name,
  label,
  value,
  options,
  onChangeHandler,
  icons,
}: {
  name: string;
  label?: string;
  value: string | null;
  options: string[];
  onChangeHandler: (a: string) => void;
  icons?: Record<string, React.ComponentType<{ className?: string }>>;
}) {
  return (
    <div className="mx-1 my-1 flex place-items-center justify-center">
      {label ? <div className="text-lg">{label}</div> : null}
      <ToggleButtonGroup
        aria-labelledby={`${name}`}
        exclusive
        size="small"
        value={value}
        onChange={(_e: React.MouseEvent<HTMLElement>, selectedValue: string) => {
          if (selectedValue !== null) onChangeHandler(selectedValue);
        }}
      >
        {options.map((option) => {
          const Icon = icons?.[option];
          return (
            <ToggleButton aria-label={option} key={option} value={option} className="min-w-24">
              {Icon && <Icon className="mr-1 text-sm" />}
              {option}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
}
