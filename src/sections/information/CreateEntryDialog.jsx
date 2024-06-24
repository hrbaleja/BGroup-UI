import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Dialog, Button, TextField, 

  DialogTitle,
  DialogContent,
  DialogActions,
 
} from '@mui/material';

const CreateEntryDialog = ({ open, onClose, onSubmit }) => {
  const [entryData, setEntryData] = useState({
    site: '',
    username: '',
    password: '',
    description: '',
  });

  const handleInputChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
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
        />
        <TextField
          name="username"
          label="Username"
          value={entryData.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="password"
          label="Password"
          value={entryData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="description"
          label="Description"
          value={entryData.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
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

CreateEntryDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

export default CreateEntryDialog;