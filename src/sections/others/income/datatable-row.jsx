import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, Popover, TableRow, MenuItem, TableCell, Typography, IconButton, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import {  fCurrency, } from 'src/utils/format-number';

import incomeService from 'src/services/others/IncomeService';

import Iconify from 'src/components/iconify';

import EditIncome from './income-edit';

export default function DataTableRow({ income, fetchIncomes }) {
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
        <TableCell>{income.name}</TableCell>
        <TableCell>{fCurrency(income.amount)}</TableCell>
        <TableCell>{income.method}</TableCell>
        <TableCell>{income.description}</TableCell>
        <TableCell>{income.category}</TableCell>
        <TableCell>{fDate(income.date)}</TableCell>
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
      </Popover>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
      >
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: '1rem', color: 'info.main' }}>
          Income Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Work Name:</strong> {income.name}</Typography>
          <Typography variant="body1"><strong>Amount:</strong> {fCurrency(income.amount)}</Typography>
          <Typography variant="body1"><strong>Method:</strong> {income.method}</Typography>
          <Typography variant="body1"><strong>Description:</strong> {income.description}</Typography>
          <Typography variant="body1"><strong>Category:</strong> {income.category}</Typography>
          <Typography variant="body1"><strong>Date:</strong> {fDate(income.date)}</Typography>
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
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
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
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    method: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  fetchIncomes: PropTypes.func.isRequired,
};