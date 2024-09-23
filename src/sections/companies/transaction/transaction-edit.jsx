import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Dialog, Button, Select, Switch, MenuItem, TextField, InputLabel, Typography, FormControl, DialogTitle, DialogContent, DialogActions, FormHelperText,
} from '@mui/material';

import TransactionService from 'src/services/company/transactionService';

export default function EditTransaction({ open, onClose, transaction, onSubmit, users, companies }) {
  const [editTransaction, setEditTransaction] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditTransaction(transaction || {});
  }, [transaction]);


  const validateForm = () => {
    const newErrors = {};

    if (!editTransaction.user) newErrors.user = 'User is required';
    if (!editTransaction.company) newErrors.company = 'Company is required';
    if (!editTransaction.lotSize) newErrors.lotSize = 'Lot Size is required';
    if (!editTransaction.appliedDate) newErrors.appliedDate = 'Applied Date is required';
    if (!editTransaction.grantedBy) newErrors.grantedBy = 'Granted By is required';
    if (!editTransaction.remarks) newErrors.remarks = 'Remarks are required';
    if (!editTransaction.applicationNo) newErrors.applicationNo = 'Application No. is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await TransactionService.updateTransaction(editTransaction.id, editTransaction);
        onSubmit();
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'is_own' || name === 'is_alloted') {
      setEditTransaction({
        ...editTransaction,
        [name]: e.target.checked,
      });
    } else {
      setEditTransaction({
        ...editTransaction,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const formatDateForTextField = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
        <Typography>Edit Transaction</Typography>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.user}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={editTransaction.user?._id || ''}
            onChange={handleInputChange}
            fullWidth
            name="user"
            label="Select User"
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          {errors.user && <FormHelperText>{errors.user}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.company}>
          <InputLabel>Select Company</InputLabel>
          <Select
            value={editTransaction.company?._id}
            onChange={handleInputChange}
            fullWidth
            name="company"
            label="Select Company"
          >
            {companies.map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
          {errors.company && <FormHelperText>{errors.company}</FormHelperText>}
        </FormControl>

        <TextField
          margin="dense"
          label="Lot Size"
          type="number"
          fullWidth
          value={editTransaction.lotSize}
          onChange={handleInputChange}
          name="lotSize"
          error={!!errors.lotSize}
          helperText={errors.lotSize}
        />

        <TextField
          margin="dense"
          label="Applied Date"
          type="date"
          fullWidth
          value={formatDateForTextField(editTransaction.appliedDate)}
          onChange={handleInputChange}
          name="appliedDate"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.appliedDate}
          helperText={errors.appliedDate}
        />

        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.grantedBy}>
          <InputLabel>Granted By</InputLabel>
          <Select
            value={editTransaction.grantedBy?._id}
            onChange={handleInputChange}
            fullWidth
            name="grantedBy"
            label="Granted By"
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          {errors.grantedBy && <FormHelperText>{errors.grantedBy}</FormHelperText>}
        </FormControl>

        <TextField
          margin="dense"
          label="Amount"
          type="number"
          fullWidth
          value={editTransaction.amount}
          onChange={handleInputChange}
          name="amount"
        />

        <TextField
          margin="dense"
          label="Remarks"
          type="text"
          fullWidth
          value={editTransaction.remarks}
          onChange={handleInputChange}
          name="remarks"
          error={!!errors.remarks}
          helperText={errors.remarks}
        />

        <TextField
          margin="dense"
          label="Application No."
          type="text"
          fullWidth
          value={editTransaction.applicationNo}
          onChange={handleInputChange}
          name="applicationNo"
          error={!!errors.applicationNo}
          helperText={errors.applicationNo}
        />

        <div>
          Is Own
          <Switch
            checked={!!editTransaction?.is_own}
            onChange={(e) => setEditTransaction({ ...editTransaction, is_own: e.target.checked })}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>

        <div>
          Is Alloted
          <Switch
            checked={!!editTransaction?.is_alloted}
            onChange={(e) => setEditTransaction({ ...editTransaction, is_alloted: e.target.checked })}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="outlined">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditTransaction.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
};