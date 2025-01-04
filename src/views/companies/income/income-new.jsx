import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Button, Select, Dialog, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogActions, DialogContent,

} from '@mui/material';

import { validateForm } from 'src/validation/validation';

const initialIncomeState = {
  transactionId: '',
  profit: '',
  sharedProfit: '',
  finalAmount: '',
};

export default function NewIncome({ open, onClose, onSubmit, transactions }) {
  const [errors, setErrors] = useState({});
  const [incomeData, setIncomeData] = useState(initialIncomeState);
 

  const validationRules = [
    { field: 'transactionId', required: true },
    { field: 'profit', required: true },
    { field: 'sharedProfit', required: true },
    { field: 'finalAmount', required: true },
  ];

  const handleInputChange = (e) => {
    setIncomeData({ ...incomeData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const newErrors = validateForm(incomeData, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(incomeData);
    setIncomeData(initialIncomeState);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Income</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ margin: '0.5rem 0' }}>
          <InputLabel>Select Transaction</InputLabel>
          <Select
            value={incomeData.transactionId}
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
          value={incomeData.profit}
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
          value={incomeData.sharedProfit}
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
          value={incomeData.finalAmount}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewIncome.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
};