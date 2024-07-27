import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

const FILTER_OPTIONS = {
  account: {
    balanceType: {
      label: 'Balance Type',
      options: ['Credit', 'Debit', 'Zero'],
      type: 'checkbox',
    },
    amount: {
      label: 'Amount',
      options: [
        { value: 'below', label: 'Below 1000' },
        { value: 'between', label: 'Between 1000 - 5000' },
        { value: 'above', label: 'Above 5000' },
      ],
      type: 'radio',
    },
  },
  user: {
    role: {
      label: 'Role',
      options: ['Admin', 'Manager', 'Employee', 'Guest'],
      type: 'checkbox',
    },
    isVerified: {
      label: 'Verified',
      options: ['Yes', 'No'],
      type: 'radio',
    },
    isActive: {
      label: 'Active',
      options: ['Yes', 'No'],
      type: 'radio',
    },
  },
  company: {
    isMain: {
      label: 'Category',
      options: ['Main', 'Subsidiary'],
      type: 'radio',
    },
    amount: {
      label: 'Amount',
      options: [
        { value: 'small', label: 'Small (<$1M)' },
        { value: 'medium', label: 'Medium ($1M - $10M)' },
        { value: 'large', label: 'Large (>$10M)' },
      ],
      type: 'radio',
    },
  },
};

export default function DynamicFilters({ filterFor, openFilter, onOpenFilter, onCloseFilter, onFilter }) {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Initialize filters based on filterFor
    const initialFilters = Object.keys(FILTER_OPTIONS[filterFor]).reduce((acc, key) => {
      acc[key] = FILTER_OPTIONS[filterFor][key].type === 'checkbox' ? [] : '';
      return acc;
    }, {});
    setFilters(initialFilters);
  }, [filterFor]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prevFilters => {
      if (FILTER_OPTIONS[filterFor][filterKey].type === 'checkbox') {
        const updatedValues = prevFilters[filterKey]?.includes(value)
          ? prevFilters[filterKey].filter(item => item !== value)
          : [...(prevFilters[filterKey] || []), value];
        return { ...prevFilters, [filterKey]: updatedValues };
      }
      return { ...prevFilters, [filterKey]: value };
    });
  };

  const handleApplyFilter = () => {
    if (typeof onFilter === 'function') {
      onFilter(filters);
    }
    onCloseFilter();
  };

  const handleClearAll = () => {
    const clearedFilters = Object.keys(FILTER_OPTIONS[filterFor]).reduce((acc, key) => {
      acc[key] = FILTER_OPTIONS[filterFor][key].type === 'checkbox' ? [] : '';
      return acc;
    }, {});
    setFilters(clearedFilters);
    if (typeof onFilter === 'function') {
      onFilter(clearedFilters);
    }
    onCloseFilter();
  };

  const renderFilterOptions = () => Object.entries(FILTER_OPTIONS[filterFor]).map(([key, { label, options, type }]) => (
    <Stack key={key} spacing={1}>
      <Typography variant="subtitle2">{label}</Typography>
      {type === 'checkbox' ? (
        <FormGroup>
          {options.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  checked={filters[key]?.includes(option) || false}
                  onChange={() => handleFilterChange(key, option)}
                  value={option}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      ) : (
        <RadioGroup value={filters[key] || ''} onChange={(e) => handleFilterChange(key, e.target.value)}>
          {options.map((option) => (
            <FormControlLabel
              key={typeof option === 'object' ? option.value : option}
              value={typeof option === 'object' ? option.value : option}
              control={<Radio />}
              label={typeof option === 'object' ? option.label : option}
            />
          ))}
        </RadioGroup>
      )}
    </Stack>
  ));

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderFilterOptions()}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={handleApplyFilter}
            startIcon={<Iconify icon="ic:round-filter-alt" />}
          >
            Apply Filters
          </Button>
        </Box>
        <Box sx={{ p: 3, pt: 0 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={handleClearAll}
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

DynamicFilters.propTypes = {
  filterFor: PropTypes.oneOf(['account', 'user', 'company']).isRequired,
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onFilter: PropTypes.func,
};