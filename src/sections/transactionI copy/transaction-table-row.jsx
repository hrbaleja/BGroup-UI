import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
import { Grid, Button, Dialog, Select, TextField, InputLabel, FormControl, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import TransactionService from 'src/services/bank/transactionService';

// import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import TransactionList from './TransactionList';
// ----------------------------------------------------------------------

export default function TransactionTableRow({
  selected,
  company, name, lotSize, appliedDate, amount, grantedBy, is_alloted, is_own, id, fetchTransaction,handleClick
}) {
  const [open, setOpen] = useState(null);
  const [openTransactionView, setOpenTransactionView] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [transactionData, setTransactionData] = useState({
    customerId: '',
    amount: 0,
    description: '',
    type: 'deposit',
  });
  // const handleOpenMenu = (event) => {
  //   setOpen(event.currentTarget);
  // };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleGetTransactions = async (_id) => {
    try {
      const fetchedTransactions = await TransactionService.getTransactionsByCustomerId(_id);
      setTransactions(fetchedTransactions);
      setOpenTransactionView(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleDetailsClick = async (_id) => {
    setOpen(null);
    handleGetTransactions(_id);
  };

  const handleOpenDialog = () => {
    setOpen(null);
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setTransactionData({
      customerId: '',
      amount: 0,
      description: '',
      type: 'deposit',
    });
    setTransactions([]);
  }
  const handleChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    try {
      transactionData.customerId = id

      const response = transactionData.type === 'deposit'
        ? await TransactionService.deposit(transactionData)
        : await TransactionService.withdraw(transactionData);
      console.log('Transaction successful:', response.data);
      handleCloseDialog()
      handleGetTransactions(transactionData.customerId);
      // fetchCustomer();

    } catch (err) {
      console.error('Transaction error:', err);
    }
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


        <MenuItem onClick={() => handleDetailsClick(id)} >
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <Iconify icon="eva:plus-fill" sx={{ mr: 2 }} />
          Transaction
        </MenuItem>
      </Popover>

      <Dialog
        open={openTransactionView}
        onClose={() => setOpenTransactionView(false)}>
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <TransactionList transactions={transactions} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={() => handleOpenDialog(false)}>
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
      </Dialog>

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
};
