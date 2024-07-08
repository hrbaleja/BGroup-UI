import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {
  Stack, Button, Dialog, Popover, TableRow, MenuItem, TableCell, Typography,
  IconButton, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import transactionService from 'src/services/company/transactionService';

import Iconify from 'src/components/iconify';

import EditTransactionDialog from './transaction-edit';

export default function DataTableRow({
  company, name, lotSize, appliedDate, amount, grantedBy, is_alloted, is_own, id, fetchTransaction, companyid, userid, users, companies, granterid
}) {

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
      await transactionService.deleteTransaction(id);
      setOpenDeleteDialog(false);
      fetchTransaction();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }, [id, fetchTransaction]);

  const handleSubmitEdit = useCallback(() => {
    setOpenEditDialog(false);
    fetchTransaction();
  }, [fetchTransaction]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Typography variant="subtitle2" noWrap>{company}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{lotSize}</TableCell>
        <TableCell>{fDate(appliedDate)}</TableCell>
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
            <Typography variant="body1"><strong>Company:</strong> {company}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {name}</Typography>
            <Typography variant="body1"><strong>Lot Size:</strong> {lotSize}</Typography>

            <Typography variant="body1"><strong>Applied Date:</strong> {fDate(appliedDate)}</Typography>
            <Typography variant="body1"><strong>Granted By:</strong> {grantedBy}</Typography>
            <Typography variant="body1"><strong>Amount:</strong> {amount}</Typography>
            <Typography variant="body1"><strong>Is Own:</strong> {is_own}</Typography>
            <Typography variant="body1"><strong>Is Alloted:</strong> {is_alloted}</Typography>
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
        transaction={{ userid, companyid, granterid, lotSize, appliedDate, amount, is_alloted, is_own, id }}
        onSubmit={handleSubmitEdit}
        users={users}
        companies={companies}
      />
    </>
  );
}

DataTableRow.propTypes = {
  company: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  lotSize: PropTypes.number.isRequired,
  appliedDate: PropTypes.string.isRequired,
  is_alloted: PropTypes.string.isRequired,
  is_own: PropTypes.string.isRequired,
  grantedBy: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  fetchTransaction: PropTypes.func.isRequired,
  companyid: PropTypes.string.isRequired,
  userid: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
  granterid: PropTypes.string.isRequired,
};