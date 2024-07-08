import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { Dialog, Button, Switch, TextField, Typography, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import CompanyService from 'src/services/company/companyService';

export default function EditCompany({ open, onClose, company, onSubmit, formatDate }) {
  const [editCompany, setEditCompany] = useState(company);
  const [errors, setErrors] = useState({});


  useEffect(() => {
    setEditCompany(company);
  }, [company]);

  const validateForm = () => {
    const newErrors = {};

    if (!editCompany.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editCompany.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }

    if (!editCompany.startDate) {
      newErrors.startDate = 'Start Date is required';
    }

    if (!editCompany.endDate) {
      newErrors.endDate = 'End Date is required';
    } else if (new Date(editCompany.endDate) <= new Date(editCompany.startDate)) {
      newErrors.endDate = 'End Date must be after Start Date';
    }

    if (editCompany.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (editCompany.lotSize <= 0) {
      newErrors.lotSize = 'Lot Size must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await CompanyService.updateCompany(editCompany._id, editCompany);
    
        setEditCompany(company);
        onSubmit();
      } catch (error) {
        console.error('Error updating company:', error);
      }
    }
  };

  const handleChange = (event) => {
    setEditCompany({
      ...editCompany,
      isMain: event.target.checked,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCompany({
      ...editCompany,
      [name]: value,
    });

    // Clear the error when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }

    // Additional check for date fields
    if (name === 'startDate' || name === 'endDate') {
      if (editCompany.startDate && editCompany.endDate) {
        if (new Date(editCompany.endDate) <= new Date(editCompany.startDate)) {
          setErrors({
            ...errors,
            endDate: 'End Date must be after Start Date',
          });
        } else {
          setErrors({
            ...errors,
            endDate: '',
          });
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
        <Typography>Edit Company</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={editCompany.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Industry"
          name="industry"
          value={editCompany.industry}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={formatDate(editCompany.startDate) || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={formatDate(editCompany.endDate) || ''}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={editCompany.amount}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Lot Size"
          name="lotSize"
          type="number"
          value={editCompany.lotSize}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Switch
          checked={editCompany.isMain}
          onChange={handleChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        Main
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="outlined"
         // disabled={Object.keys(errors).some(key => errors[key])}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};