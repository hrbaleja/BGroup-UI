import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Grid, Stack, Button, Dialog, Select, Avatar, Popover, TableRow, MenuItem, TextField,
  TableCell, Typography, IconButton, InputLabel, FormControl, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';

import PublicService from 'src/services/public/publicService';
import { useNotification } from 'src/context/NotificationContext';
import TransactionService from 'src/services/account/transactionService';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import TransactionList from './transaction-list';

const APP_URL = import.meta.env.VITE_APP_URL;

const initialTransactionData = {
  customerId: '',
  amount: 0,
  description: '',
  type: 'deposit',
};

export default function DataTableRow({
  name,
  avatarUrl,
  updatedAt,
  balance,
  balanceType,
  id,
  fetchCustomer,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTransactionView, setOpenTransactionView] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [transactionData, setTransactionData] = useState(initialTransactionData);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const [token, setToken] = useState('');
  const { showNotification } = useNotification();


  const handleGetTransactions = useCallback(async () => {
    try {
      const fetchedTransactions = await TransactionService.getTransactionsByCustomerId(id);
      setTransactions(fetchedTransactions);
      setOpenTransactionView(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [id]);

  const handleDetailsClick = useCallback(
    (AccoutId) => {
      handleCloseMenu();
      handleGetTransactions(AccoutId);
    },
    [handleGetTransactions]
  );

  const handleOpenDialog = useCallback(() => {
    handleCloseMenu();
    setOpenAddDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenAddDialog(false);
    setTransactionData(initialTransactionData);
  }, []);

  const handleChange = useCallback((e) => {
    const { name: fieldName, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const updatedTransactionData = { ...transactionData, customerId: id };
      if (updatedTransactionData.type === 'deposit') {
        await TransactionService.deposit(updatedTransactionData)
      }
      else {
        await TransactionService.withdraw(updatedTransactionData);
      }
      handleCloseDialog();
      fetchCustomer();
    } catch (err) {
      console.error('Transaction error:', err);
    }
  }, [transactionData, id, handleCloseDialog, fetchCustomer]);

  const handleShareLink = async () => {
    setToken(null)
    try {
      const response = await PublicService.getTokenByCustomerId(id);
      setToken(response.TokenId);
      showNotification('Link copied to clipboard!', {
        severity: 'success',
      });
      handleCloseMenu();
      console.log(`http://10.0.1.218:3030/account/${response.TokenId}`);
    } catch (error) {
      showNotification('Error in generating Link!', {
        severity: 'error',
      });
      console.error('Error generating Link:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap marginLeft={1}>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{updatedAt}</TableCell>
        <TableCell align="right" sx={{ paddingRight: '5%' }} >{balance}</TableCell>
        <TableCell align="center">
          <Label color={balanceType === 'Debit' ? 'error' : 'success'}>{balanceType}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 140 } }}
      >
        <MenuItem onClick={() => handleDetailsClick(id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <Iconify icon="eva:plus-fill" sx={{ mr: 2 }} />
          Transaction
        </MenuItem>
        <CopyToClipboard text={`${APP_URL}account/${token}`} onCopy={() => console.log("Link copied!")}>
          <MenuItem onClick={handleShareLink}>
            <Iconify icon="eva:share-fill" sx={{ mr: 2 }} />
            Share Link
          </MenuItem>
        </CopyToClipboard>
      </Popover>

      <Dialog
        open={openTransactionView}
        onClose={() => setOpenTransactionView(false)}
        PaperProps={{
          sx: {
            minWidth: { xs: '90%', sm: '800px' },
            maxWidth: { xs: '90%', sm: '800px' },
          },
        }}
      >
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <TransactionList transactions={transactions} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransactionView(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Add Transaction
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField label="Account Holder" value={name} fullWidth margin="normal" />
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

DataTableRow.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string,
  updatedAt: PropTypes.string,
  balanceType: PropTypes.string,
  balance: PropTypes.string,
  id: PropTypes.string.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
};