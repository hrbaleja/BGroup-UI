import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Stack, Button, Dialog, Popover, TableRow, MenuItem, TableCell, Typography,
  IconButton, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import transactionService from 'src/services/company/transactionService';

import Iconify from 'src/components/iconify';

import EditTransactionDialog from './transaction-edit';

export default function DataTableRow({ transaction, fetchTransaction, users, companies }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleInfoClick = useCallback(() => {
    setOpenInfoDialog(true);
    handleCloseMenu();
  }, []);

  const handleEditClick = useCallback(() => {
    setOpenEditDialog(true);
    handleCloseMenu();
  }, []);

  const handleDeleteClick = useCallback(() => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await transactionService.deleteTransaction(transaction._id);
      setOpenDeleteDialog(false);
      fetchTransaction();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }, [transaction._id, fetchTransaction]);

  const handleSubmitEdit = useCallback(() => {
    setOpenEditDialog(false);
    fetchTransaction();
  }, [fetchTransaction]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Typography variant="subtitle2" noWrap>{transaction.company.name ? transaction.company.name : ''}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{transaction.user.name ? transaction.user.name : ''}</TableCell>
        <TableCell>{transaction.lotSize ? transaction.lotSize : ''}</TableCell>
        <TableCell> {fDate(transaction.appliedDate)}</TableCell>
        <TableCell>{transaction.grantedBy.name || ''}</TableCell>
        <TableCell align="right">{fCurrency(transaction.amount)}</TableCell>
        <TableCell align="center">{transaction.is_own ? 'Yes' : 'No'}</TableCell>
        <TableCell align="center">{transaction.is_alloted ? 'Yes' : 'No'}</TableCell>
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
        <MenuItem onClick={handleInfoClick} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleEditClick}>
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="fluent:delete-16-filled" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openInfoDialog} onClose={() => setOpenInfoDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Transaction Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Company:</strong> {transaction.company.name || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Name:</strong> {transaction.user.name || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Lot Size:</strong> {transaction.lotSize || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Applied Date:</strong> {transaction.appliedDate || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Granted By:</strong> {transaction.grantedBy.name || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Amount:</strong> {transaction.amount || 'N/A'}</Typography>
          <Typography variant="body1"><strong>Is Own:</strong> {transaction.is_own ? 'Yes' : 'No'}</Typography>
          <Typography variant="body1"><strong>Is Alloted:</strong> {transaction.is_alloted ? 'Yes' : 'No'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfoDialog(false)} variant='outlined'>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>Are you sure you want to delete this transaction?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <EditTransactionDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        transaction={transaction}
        onSubmit={handleSubmitEdit}
        users={users}
        companies={companies}
      />
    </>
  );
}

DataTableRow.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    company: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
      }),
    ]),
    lotSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    appliedDate: PropTypes.string,
    user: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
      }),
    ]),
    grantedBy: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.string,
      }),
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_own: PropTypes.bool,
    is_alloted: PropTypes.bool,
  }).isRequired,
  fetchTransaction: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
};