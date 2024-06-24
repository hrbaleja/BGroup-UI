import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
    Box, Dialog, Button, MenuItem, TextField, DialogTitle, DialogContent, DialogActions

} from '@mui/material';

import CustomerService from 'src/services/bank/customerService';



const NewCustomerForm = ({ open, handleClose, handleCreateCustomer }) => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState([0]);
    const [initialBalance, setInitialBalance] = useState(0);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await CustomerService.fetchNonCustomer();
                setCustomers(response);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCustomer) {
            handleCreateCustomer(selectedCustomer._id, initialBalance);
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} >
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
                <Button onClick={handleClose}>Cancel</Button>
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
};

NewCustomerForm.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCreateCustomer: PropTypes.func.isRequired,
};

export default NewCustomerForm;

