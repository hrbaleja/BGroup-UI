import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Dialog,
  Button,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import AccountsService from 'src/services/bank/accountsService';

export default function NewAccount({ open, onClose, handleCreateCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [initialBalance, setInitialBalance] = useState(0);
  const [formError, setFormError] = useState(false); // State for form validation error

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await AccountsService.fetchNonCustomer();
        setCustomers(response);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setFormError(true);
      return;
    }

    handleCreateCustomer(selectedCustomer._id, initialBalance);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New User Account</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '300px' }}>
          <TextField
            id="customerDropdown"
            select
            label="Select Customer"
            value={selectedCustomer ? selectedCustomer._id : ''}
            onChange={(e) =>
              setSelectedCustomer(customers.find((customer) => customer._id === e.target.value))
            }
            fullWidth
            margin="normal"
            error={formError && !selectedCustomer}
            helperText={formError && !selectedCustomer ? 'Please select a customer' : ''}
          >
            {customers.length > 0 ? (
              customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No customers available</MenuItem>
            )}
          </TextField>
          <TextField
            id="initialBalance"
            label="Transaction Amount"
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
            fullWidth
            margin="normal"
            disabled
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="outlined"
          onClick={handleSubmit}
          disabled={!selectedCustomer}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NewAccount.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleCreateCustomer: PropTypes.func.isRequired,
};
