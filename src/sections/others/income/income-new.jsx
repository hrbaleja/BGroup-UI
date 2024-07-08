import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Button, Select, Dialog, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogActions, DialogContent, FormHelperText, } from '@mui/material';

import { validateForm } from 'src/validation/validation';

const initialIncomeState = {
  amount: '',
  method: '',
  description: '',
  category: '',
  date: '',
};

const paymentMethods = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Other', label: 'Other' },
];

export default function NewIncome({ open, onClose, onSubmit }) {
  const [errors, setErrors] = useState({});
  const [incomeData, setIncomeData] = useState(initialIncomeState);

  const validationRules = [
    { field: 'name', required: true },
    { field: 'amount', required: true },
    { field: 'method', required: true },
    { field: 'description', required: true },
    { field: 'category', required: true },
    { field: 'date', required: true },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIncomeData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = validateForm(incomeData, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(incomeData);
    setIncomeData(initialIncomeState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Income</DialogTitle>
      <DialogContent>
      <TextField
          name="name"
          label="Work Name"
          value={incomeData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          name="amount"
          label="Amount"
          value={incomeData.amount}
          onChange={handleInputChange}
          fullWidth
          type="number"
          margin="normal"
          required
          error={Boolean(errors.amount)}
          helperText={errors.amount}
        />

        <FormControl fullWidth margin="normal" error={Boolean(errors.method)}>
          <InputLabel>Method</InputLabel>
          <Select
            name="method"
            label='Method'
            value={incomeData.method}
            onChange={handleInputChange}
            required
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method.value} value={method.value}>
                {method.label}
              </MenuItem>
            ))}
          </Select>
          {errors.method && <FormHelperText>{errors.method}</FormHelperText>}
        </FormControl>

        <TextField
          name="description"
          label="Description"
          value={incomeData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.description)}
          helperText={errors.description}
        />

        <TextField
          name="category"
          label="Category"
          value={incomeData.category}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.category)}
          helperText={errors.category}
        />

        <TextField
          name="date"
          label="Date"
          value={incomeData.date}
          onChange={handleInputChange}
          fullWidth
          type="date"
          margin="normal"
          required
          InputLabelProps={{ shrink: true }}
          error={Boolean(errors.date)}
          helperText={errors.date}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NewIncome.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};