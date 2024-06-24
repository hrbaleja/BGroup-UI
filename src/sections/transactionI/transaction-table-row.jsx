import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import { Grid, Button, Dialog, Select, TextField, InputLabel, FormControl, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

// import TransactionService from 'src/services/ipo/transactionService';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TransactionTableRow({
  selected,
  company, name, lotSize, appliedDate, amount, grantedBy, is_alloted, is_own, id, fetchTransaction, handleClick, handleOpenEditModal
}) {
  const [open, setOpen] = useState(null);
  // const [openTransactionView, setOpenTransactionView] = useState(false);
  // const [transactions, setTransactions] = useState([]);
  // const [openAddDialog, setOpenAddDialog] = useState(false);
 
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };


  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={() => handleClick(id)} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {company}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{lotSize}</TableCell>
        <TableCell>{appliedDate}</TableCell>
        <TableCell>{grantedBy}</TableCell>
        <TableCell>{amount}</TableCell>
        <TableCell>{is_own}</TableCell>
        <TableCell>{is_alloted}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >


        <MenuItem onClick={() => handleOpenEditModal(id)} >
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={() => handleOpenEditModal(id)}>
          <Iconify icon="eva:plus-fill" sx={{ mr: 2 }} />
          Transaction
        </MenuItem>
      </Popover>


      {/* <Dialog open={openAddDialog} onClose={() => handleOpenDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          <Typography variant="h4" >Add Transaction</Typography></DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                label={name}
                value={name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={transactionData.amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={transactionData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="transaction-type-label">Type</InputLabel>
                <Select
                  labelId="transaction-type-label"
                  name="type"
                  label="Type"
                  value={transactionData.type}
                  onChange={handleChange}
                >
                  <MenuItem value="deposit">Deposit</MenuItem>
                  <MenuItem value="withdrawal">Withdrawal</MenuItem>
                </Select>
              </FormControl>

            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button variant="outlined" color="primary" onClick={handleSubmit}>
            Submit
          </Button>

        </DialogActions>
      </Dialog> */}

    </>
  );
}

TransactionTableRow.propTypes = {
  company: PropTypes.string,
  name: PropTypes.string,
  lotSize: PropTypes.number,
  appliedDate: PropTypes.any,
  is_alloted: PropTypes.string,
  is_own: PropTypes.string,
  handleClick: PropTypes.func,
  grantedBy: PropTypes.any,
  amount: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.string,
  fetchTransaction: PropTypes.func.isRequired,
  handleOpenEditModal: PropTypes.func.isRequired,
};
