import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { Button, Select, Dialog, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogActions, DialogContent, } from '@mui/material';

import { validateForm } from 'src/validation/validation';

export default function EditIncome({ open, onClose, onSubmit, incomeData, transactions }) {
  const [errors, setErrors] = useState({});
  const [editedIncome, setEditedIncome] = useState({
    transactionId: '',
    profit: '',
    sharedProfit: '',
    finalAmount: '',
  });

  const validationRules = [
    { field: 'transactionId', required: true },
    { field: 'profit', required: true },
    { field: 'sharedProfit', required: true },
    { field: 'finalAmount', required: true },
  ];

  useEffect(() => {
    if (incomeData) {
      setEditedIncome({
        transactionId: incomeData.application || '',
        profit: incomeData.profit || '',
        sharedProfit: incomeData.sharedProfit || '',
        finalAmount: incomeData.finalAmount || '',
      });
    }
  }, [incomeData]);

  const handleInputChange = (e) => {
    setEditedIncome({ ...editedIncome, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const newErrors = validateForm(editedIncome, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(editedIncome);
    setEditedIncome({
      transactionId: '',
      profit: '',
      sharedProfit: '',
      finalAmount: '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
    <DialogTitle>Edit Income</DialogTitle>
    <DialogContent>
      <FormControl fullWidth sx={{ margin: '0.5rem 0' }}>
        <InputLabel>Select Transaction</InputLabel>
        <Select
          value={editedIncome.transactionId}
          onChange={handleInputChange}
          fullWidth
          name="transactionId"
          label="Select Transaction"
          error={Boolean(errors.transactionId)}
        >
          <MenuItem value="">Select Transaction</MenuItem>
          {transactions.map((transaction) => (
            <MenuItem key={transaction._id} value={transaction._id}>
              {`${transaction.company?.name} - ${transaction.user?.name}`}
            </MenuItem>
          ))}
        </Select>
        {errors.transactionId && <p style={{ color: 'red', marginTop: '0.5rem' }}>{errors.transactionId}</p>}
      </FormControl>
      <TextField
        name="profit"
        label="Profit"
        value={editedIncome.profit}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
        required
        error={Boolean(errors.profit)}
        helperText={errors.profit}
      />
      <TextField
        name="sharedProfit"
        label="Shared Profit"
        value={editedIncome.sharedProfit}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
        required
        error={Boolean(errors.sharedProfit)}
        helperText={errors.sharedProfit}
      />
      <TextField
        name="finalAmount"
        label="Final Amount"
        value={editedIncome.finalAmount}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        type="number"
        required
        error={Boolean(errors.finalAmount)}
        helperText={errors.finalAmount}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleSubmit} variant="outlined">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);
};

EditIncome.propTypes = {
open: PropTypes.bool.isRequired,
onClose: PropTypes.func.isRequired,
onSubmit: PropTypes.func.isRequired,
incomeData: PropTypes.object.isRequired,
transactions: PropTypes.array.isRequired,
};