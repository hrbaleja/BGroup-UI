import { useState } from 'react';
import PropTypes from 'prop-types';

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

export const BALANCE_TYPE_OPTIONS = ['Credit', 'Debit', 'Zero'];
export const AMOUNT_OPTIONS = [
  { value: 'below', label: 'Below 1000' },
  { value: 'between', label: 'Between 1000 - 5000' },
  { value: 'above', label: 'Above 5000' },
];

export default function AccountFilters({ openFilter, onOpenFilter, onCloseFilter, onFilter }) {
  const [balanceTypes, setBalanceTypes] = useState([]);
  const [amount, setAmount] = useState('');

  const handleBalanceTypeChange = (event) => {
    const { value, checked } = event.target;
    setBalanceTypes((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)));
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleApplyFilter = () => {
    onFilter({ balanceTypes, amount });
    onCloseFilter();
  };

  const handleClearAll = () => {
    setBalanceTypes([]);
    setAmount('');
    onCloseFilter();
  };

  const renderBalanceType = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Balance Type</Typography>
      <FormGroup>
        {BALANCE_TYPE_OPTIONS.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={balanceTypes.includes(item)}
                onChange={handleBalanceTypeChange}
                value={item}
              />
            }
            label={item}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderAmount = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Amount</Typography>
      <RadioGroup value={amount} onChange={handleAmountChange}>
        {AMOUNT_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

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
            {renderBalanceType}
            {renderAmount}
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

AccountFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  onFilter: PropTypes.func,
};
