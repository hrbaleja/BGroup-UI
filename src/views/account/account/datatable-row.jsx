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
import AccountsService from 'src/services/account/accountsService';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
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

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const getAccountTransaction = useCallback(async () => {
    handleCloseMenu();
    try {
      const fetchedTransactions = await TransactionService.getTransactionsByCustomerId(id);
      setTransactions(fetchedTransactions);
      setOpenTransactionView(true);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [id]);

  const deleteCustomerAccount = useCallback(async (accountId) => {
    try {
      await AccountsService.deleteCustomerAccount(accountId);
      showNotification('Account deleted successfully!', { severity: 'success' });
      fetchCustomer();
    } catch (err) {
      showNotification('Error deleting account!', { severity: 'error' });
      console.error('Error deleting account:', err);
    }
  }, [fetchCustomer]);

  const handleShareViaEmail = async (customerId) => {
    handleCloseMenu();
    try {
      // Fetch transactions for the customer on the frontend
      const fetchedTransactions = await TransactionService.getTransactionsByCustomerId(customerId);

      if (!fetchedTransactions || fetchedTransactions.length === 0) {
        showNotification('No transactions found for this account.', { severity: 'info' });
        return;
      }

      // Generate HTML table for the transactions
      const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f0f8ff, #e6f7ff); padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #2c3e50; text-align: center; font-size: 26px; margin-bottom: 20px; font-weight: 600;">Your Recent Transactions</h3>
        <table style="border-collapse: collapse; width: 100%; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #6dd5ed, #2193b0); color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 600;">Date</th>
              <th style="padding: 15px; text-align: left; font-weight: 600;">Description</th>
              <th style="padding: 15px; text-align: left; font-weight: 600;">Debit</th>
              <th style="padding: 15px; text-align: left; font-weight: 600;">Credit</th>
              <th style="padding: 15px; text-align: left; font-weight: 600;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${fetchedTransactions
              .map(
                (transaction) => `
                  <tr style="border-bottom: 1px solid #eee; transition: background-color 0.3s;">
                    <td style="padding: 12px; color: #555;">${fDate(transaction.txnDate)}</td>
                    <td style="padding: 12px; color: #555;">${transaction.description}</td>
                    <td style="padding: 12px; color: #555;">${transaction.debit ? fCurrency(transaction.debit) : "-"}</td>
                    <td style="padding: 12px; color: #555;">${transaction.credit ? fCurrency(transaction.credit) : "-"}</td>
                    <td style="padding: 12px; color: #555; font-weight: 500;">${fCurrency(transaction.balance)}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <div style="text-align: center; margin-top: 25px;">
          <a href="#" style="background: linear-gradient(135deg, #6dd5ed, #2193b0); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: 500; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            View Full Statement
          </a>
        </div>
        <div style="text-align: center; margin-top: 25px; font-size: 12px; color: #777;">
          <p>If you have any questions, feel free to <a href="#" style="color: #2193b0; text-decoration: none;">contact our support team</a>.</p>
          <p>&copy; 2025 B Group Pvt. Ltd. All rights reserved.</p>
        </div>
      </div>
    `;
    console.log(htmlContent)
      // Prepare email data payload
      const emailData = {
        to: 'hrbaleja.04@gmail.com',
        subject: 'Your Transaction Details',
        html: htmlContent, // Pass the HTML content directly
      };

      // // Send email using the backend API
      const response = await AccountsService.sendTransactionEmail(emailData);
      if (response.success) {
        showNotification('Email sent successfully!', { severity: 'success' });
      } else {
        showNotification('Failed to send email!', { severity: 'error' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      showNotification('Failed to send email!', { severity: 'error' });
    }
  };

  // Open confirmation dialog before deleting
  const handleDeleteAccountClick = (accountId) => {
    setDeleteConfirmId(accountId);
    setOpenDeleteConfirmDialog(true);
  };

  // Confirm account deletion
  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteCustomerAccount(deleteConfirmId);
      setOpenDeleteConfirmDialog(false);
    }
  };

  // Close confirmation dialog without deleting
  const handleCancelDelete = () => {
    setOpenDeleteConfirmDialog(false);
    setDeleteConfirmId(null);
  };

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
        <MenuItem onClick={() => getAccountTransaction(id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={() => handleShareViaEmail(id)} sx={{ color: 'primary.darker' }}>
          <Iconify icon="fluent:mail-28-filled" sx={{ mr: 2 }} />
          E-mail
        </MenuItem>
        {parseFloat(balance) === 0 && (
          <MenuItem onClick={() => handleDeleteAccountClick(id)} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        )}
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
        open={openDeleteConfirmDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="outlined">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openTransactionView}
        onClose={() => setOpenTransactionView(false)}
        PaperProps={{
          sx: {
            minWidth: { xs: '95%', sm: '800px' },
            maxWidth: { xs: '95%', sm: '800px' },
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