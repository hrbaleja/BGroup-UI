import { useState, } from 'react';
import PropTypes from 'prop-types';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableSort({ sortOptions, onSortChange }) {
  const defaultOption = { value: 'all', label: 'All' };
  const [open, setOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (option) => {
    setSelectedOption(option);
    setOpen(null);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Sort By:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {selectedOption.label}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={() => handleClose(selectedOption)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {sortOptions && sortOptions.length > 0 ? (
          sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === selectedOption.value}
              onClick={() => handleClose(option)}
            >
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            No sorting options available
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

TableSort.propTypes = {
  sortOptions: PropTypes.array.isRequired,
  onSortChange: PropTypes.func,
};
