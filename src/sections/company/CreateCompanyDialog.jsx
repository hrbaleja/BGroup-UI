import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Stack, Dialog, Button, Switch, TextField, DialogTitle, DialogContent, DialogActions,

} from '@mui/material';

import companyService from 'src/services/ipo/companyService';


const CreateCompanyDialog = ({ open, onClose,  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    startDate: null,
    endDate: null,
    amount: 0,
    lotSize: 0,
    isMain: true
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    }
    if (!formData.lotSize) {
      newErrors.isMain = 'Lot size is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true);
      try {

        await companyService.createCompany(formData);
        onClose();
        //  fetchCompanies();
      } catch (error) {
        console.error('Error creating company:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
        Create Company
      </DialogTitle>

      <DialogContent >
        <form onSubmit={handleSubmit}>

          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />
          <TextField
            fullWidth
            id="industry"
            name="industry"
            label="Industry"
            value={formData.industry}
            onChange={handleChange}
            error={!!errors.industry}
            helperText={errors.industry}
            margin="normal"
          />
          <TextField
            fullWidth
            id="startDate"
            name="startDate"
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            id="endDate"
            name="endDate"
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
          <TextField
            fullWidth
            id="amount"
            name="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            margin="normal"
          />
          <TextField
            fullWidth
            id="lotSize"
            name="lotSize"
            label="Lot Size"
            type="number"
            value={formData.lotSize}
            onChange={handleChange}
            error={!!errors.lotSize}
            helperText={errors.lotSize}
            margin="normal"
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            Main
            <Switch
              value={formData.isMain}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

    </Dialog>
  );
};
CreateCompanyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // fetchCompanies: PropTypes.func.isRequired,
};
export default CreateCompanyDialog;