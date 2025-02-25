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

import { PAGE_TITLES } from 'src/constants/page';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

export const AMOUNT_OPTIONS = [
  { value: 'below', label: 'Below 1000' },
  { value: 'between', label: 'Between 1000 - 5000' },
  { value: 'above', label: 'Above 5000' },
];

const FILTER_CONFIG = {
  [PAGE_TITLES.ACCOUNT]: {
    balanceType: {
      label: 'Balance Type',
      options: [
        { value: 'Credit', label: 'Credit' },
        { value: 'Debit', label: 'Debit' },
        { value: 'Zero', label: 'Zero' },
      ],
      type: 'radio',
    },
    amount: {
      label: 'Amount',
      options: AMOUNT_OPTIONS,
      type: 'radio',
    },
  },
  [PAGE_TITLES.COMPANY]: {
    isMain: {
      label: 'Category',
      options: [
        { value: 1, label: 'SME' },
        { value: 0, label: 'Main Board' },

      ],
      type: 'radio',
    },
    amount: {
      label: 'Amount',
      options: [
        { value: 15000, label: 'Small (<$1M)' },
        { value: 'medium', label: 'Medium ($1M - $10M)' },
        { value: 'large', label: 'Large (>$10M)' },
      ],
      type: 'radio',
    },
  },
  [PAGE_TITLES.USERS]: {
    role: {
      label: 'Role',
      options: [
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Manager' },
        { value: 3, label: 'Employee' },
        { value: 4, label: 'Guest' }
      ],
      type: 'checkbox',
    },
    isVerified: {
      label: 'Verified',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      type: 'radio',
    },
    isActive: {
      label: 'Active',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      type: 'radio',
    },
    isDematUsers: {
      label: 'Demat Users',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      type: 'radio',
    },
  },
  [PAGE_TITLES.INCOME]: {
    amount: {
      label: 'Amount',
      options: [
        { value: 1000, label: 'Up to 1000' },
        { value: 10000, label: 'Less then 10000' },
        { value: 10001, label: 'More then 10000' },
      ],
      type: 'radio',
    },
  },
  [PAGE_TITLES.TRANSACTIONS]: {
    isAlloted: {
      label: 'Is Alloted',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      type: 'radio',
    },
    isOwn: {
      label: 'Is Own',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ],
      type: 'radio',
    },
  },
  [PAGE_TITLES.OTHER_INCOME]: {
    amount: {
      label: 'Amount',
      options: [
        { value: 1000, label: 'Up to 1000' },
        { value: 10000, label: 'Less then 10000' },
        { value: 10001, label: 'More then 10000' },
      ],
      type: 'radio',
    },
  },
};
export default function TableFilters({ filterFor, openFilter, onOpenFilter, onCloseFilter, onFilter }) {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setFilters(initializeFilters(filterFor));
  }, [filterFor]);

  const initializeFilters = (filterType) => {
    const filterConfig = FILTER_CONFIG[filterType] || {};
    const initialState = {};
    Object.keys(filterConfig).forEach((key) => {
      initialState[key] = '';
    });
    return initialState;
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterKey]: value,
    }));
  };

  const handleApplyFilter = () => {
    if (typeof onFilter === 'function') {
      onFilter(filters);
    }
    onCloseFilter();
  };

  const handleClearAll = () => {
    initializeFilters()
    setFilters({});
    if (typeof onFilter === 'function') {
      onFilter({});
    }
    onCloseFilter();
  };

  const renderFilter = (filterKey, filterConfig) => {
    const { label, options, type } = filterConfig;

    switch (type) {
      case 'checkbox':
        return (
          <Stack key={filterKey} spacing={1}>
            <Typography variant="subtitle2">{label}</Typography>
            <FormGroup>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={filters[filterKey]?.includes(option.value)}
                      onChange={(e) => {
                        const value = e.target.checked
                          ? [...(filters[filterKey] || []), option.value]
                          : (filters[filterKey] || []).filter(item => item !== option.value);
                        handleFilterChange(filterKey, value);
                      }}
                    />
                  }
                  label={String(option.label)}
                />
              ))}
            </FormGroup>
          </Stack>
        );
      case 'radio':
        return (
          <Stack key={filterKey} spacing={1}>
            <Typography variant="subtitle2">{label}</Typography>
            <RadioGroup
              value={filters[filterKey] || ''}
              onChange={(e) => handleFilterChange(filterKey, e.target.value)}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={String(option.label)}
                />
              ))}
            </RadioGroup>
          </Stack>
        );
      default:
        return null;
    }
  };

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
            {FILTER_CONFIG[filterFor] &&
              Object.entries(FILTER_CONFIG[filterFor]).map(([filterKey, filterConfig]) =>
                renderFilter(filterKey, filterConfig)
              )}
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

TableFilters.propTypes = {
  filterFor: PropTypes.string.isRequired,
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onFilter: PropTypes.func,
};