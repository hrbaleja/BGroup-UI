import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { validateForm } from 'src/validation/validation';

export default function NewCredential({ open, onClose, onSubmit }) {
  const [errors, setErrors] = useState({});
  const [entryData, setEntryData] = useState({
    site: '',
    username: '',
    password: '',
    description: '',
  });

  const validationRules = [
    { field: 'site', required: true },
    { field: 'username', required: true },
    { field: 'password', required: true },
    
  ];

  const handleInputChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = () => {
    const newErrors = validateForm(entryData, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(entryData);
    setEntryData({
      site: '',
      username: '',
      password: '',
      description: '',
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Entry</DialogTitle>
      <DialogContent>
        <TextField
          name="site"
          label="Site"
          value={entryData.site}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.site)}
          helperText={errors.site}
        />
        <TextField
          name="username"
          label="Username"
          value={entryData.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.username)}
          helperText={errors.username}
        />
        <TextField
          name="password"
          label="Password"
          value={entryData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          type="password"
          error={Boolean(errors.password)}
          helperText={errors.password}
        />
        <TextField
          name="description"
          label="Description"
          value={entryData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.description)}
          helperText={errors.description}
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

NewCredential.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};