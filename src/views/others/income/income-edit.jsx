import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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

export default function EditIncome({ open, onClose, onSubmit, incomeData }) {
  const [errors, setErrors] = useState({});
  const [editedIncome, setEditedIncome] = useState(initialIncomeState);

  const validationRules = [
    { field: 'name', required: true },

    { field: 'amount', required: true },
    { field: 'method', required: true },
    { field: 'description', required: true },
    { field: 'category', required: true },
    { field: 'date', required: true },
  ];

  useEffect(() => {
    if (incomeData) {
      setEditedIncome({
        name:incomeData.name || '',
        amount: incomeData.amount || '',
        method: incomeData.method || '',
        description: incomeData.description || '',
        category: incomeData.category || '',
        date: incomeData.date || '',
      });
    }
  }, [incomeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedIncome((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = () => {
    const newErrors = validateForm(editedIncome, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(editedIncome);
    onClose();
  };

  const formatDateForTextField = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Income</DialogTitle>
      <DialogContent>
      <TextField
          name="name"
          label="Work Name"
          value={editedIncome.name}
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
          value={editedIncome.amount}
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
            value={editedIncome.method}
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
          value={editedIncome.description}
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
          value={editedIncome.category}
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
          value={formatDateForTextField(editedIncome.date)}
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
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditIncome.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  incomeData: PropTypes.object.isRequired,
};