import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,  } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import incomeService from 'src/services/company/incomeService';

import Iconify from 'src/components/iconify';

import EditIncome from './income-edit';

export default function DataTableRow({
  income,
  fetchIncomes,
  transactions,
}) {
  const [open, setOpen] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };


  const handleDetailsClick = () => {
    setOpen(null);
    setOpenDetailsDialog(true);
  };

  const handleEdit = () => {
    setOpen(null);
    setOpenEditDialog(true);
  };

  const handleDelete = () => {
    setOpen(null);
    setOpenDeleteDialog(true);
  };

  const handleSubmitEdit = async (editedData) => {
    try {
      await incomeService.updateIncome(income._id, editedData);
      setOpenEditDialog(false);
      fetchIncomes();
    } catch (err) {
      console.error('Error updating income:', err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await incomeService.deleteIncome(income._id);
      setOpenDeleteDialog(false);
      fetchIncomes();
    } catch (err) {
      console.error('Error deleting income:', err);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{income.application}</TableCell>
        <TableCell>{`${fCurrency(income.profit)}`}</TableCell>
        <TableCell>{fCurrency(income.sharedProfit)}</TableCell>
        <TableCell>{fCurrency(income.finalAmount)}</TableCell>
        <TableCell>{`${fDate(income.createdAt)}`}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleDetailsClick}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="fluent:delete-16-filled" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover >

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>   Income Details</DialogTitle>
        <DialogContent >
          <Typography variant="body1"> <strong>Application No:</strong> {income.application}</Typography>
          <Typography variant="body1"><strong>Profit: </strong> {income.profit}</Typography>
          <Typography variant="body1"><strong>Shared Profit: </strong> {income.sharedProfit}</Typography>
          <Typography variant="body1"><strong>Final Amount:</strong>  {income.finalAmount}</Typography>
          <Typography variant="body1"><strong>Date:</strong>  {income.createdAt}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <EditIncome
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleSubmitEdit}
        incomeData={income}
        transactions={transactions}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Income</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this income?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DataTableRow.propTypes = {
  income: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    application: PropTypes.string.isRequired,
    profit: PropTypes.number.isRequired,
    sharedProfit: PropTypes.number.isRequired,
    finalAmount: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  fetchIncomes: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
};