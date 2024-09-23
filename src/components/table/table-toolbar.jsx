import { useState } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { PAGE_TITLES } from 'src/constants/page';

import Iconify from 'src/components/iconify';

import TableFilters from './table-filters';



export default function TableToolbar({ filterName, onFilterName, filters, onFilter, filterFor }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filterName);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      onFilterName(searchTerm);
    }
  };

  const handleOpenFilter = () => {
    setSearchTerm('');
    setOpenFilter(true);
  };

  const hasCredential = filterFor !== PAGE_TITLES.CREDENTIALS;


  return (

    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown ={handleSearchKeyPress}
        placeholder="Search ..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />

      {hasCredential && (
        <Tooltip title="Filter">
          <div>
            <TableFilters
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={() => setOpenFilter(false)}
              onFilter={onFilter}
              filters={filters}
              filterFor={filterFor}
            />
          </div>
        </Tooltip>
      )}
    </Toolbar>
  );
}

TableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filters: PropTypes.object,
  onFilter: PropTypes.func,
  filterFor: PropTypes.string,
};
