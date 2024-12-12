import PropTypes from 'prop-types';
import React, { useState } from 'react';

import {
  Stack, Button, Switch, Select, Dialog, MenuItem, TextField, InputLabel, DialogTitle, FormControl, DialogActions, DialogContent,
  FormHelperText
} from '@mui/material';

import { validateForm } from 'src/validation/validation';

export default function NewTransaction({ open, onClose, onSubmit, users, companies }) {
  const today = new Date().toISOString().split('T')[0];
  const initialTransactionState = {
    user: '',
    company: '',
    lotSize: '1',
    appliedDate: today,
    is_own: false,
    grantedBy: '665169a1608ccd96f62132b8',
    amount: '',
    is_alloted: false,
    remarks: 'ASBA',
    applicationNo: '',
  };

  const [transactionData, setTransactionData] = useState(initialTransactionState);
  const [errors, setErrors] = useState({});

  const validationRules = [
    { field: 'user', required: true },
    { field: 'company', required: true },
    { field: 'lotSize', required: true },
    { field: 'appliedDate', required: true },
    { field: 'grantedBy', required: true },
    { field: 'remarks', required: true },
    { field: 'applicationNo', required: true },
  ];
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const createTransaction = () => {
    const newErrors = validateForm(transactionData, validationRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
     else {
      onSubmit(transactionData);
      setTransactionData(initialTransactionState);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
        Create Transaction
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.user}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={transactionData.user}
            onChange={handleInputChange}
            fullWidth
            name="user"
            label="Select User"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                },
              },
            }}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          {errors.user && <FormHelperText>{errors.user}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.company}>
          <InputLabel>Select Company</InputLabel>
          <Select
            value={transactionData.company}
            onChange={handleInputChange}
            fullWidth
            name="company"
            label="Select Company"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                },
              },
            }}
          >
            {companies.map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.name}
              </MenuItem>
            ))}
          </Select>
          {errors.company && <FormHelperText>{errors.company}</FormHelperText>}
        </FormControl>

        <TextField
          margin="dense"
          label="Lot Size"
          type="number"
          fullWidth
          value={transactionData.lotSize}
          onChange={handleInputChange}
          name="lotSize"
          error={!!errors.lotSize}
          helperText={errors.lotSize}
        />

        <TextField
          margin="dense"
          label="Applied Date"
          type="date"
          fullWidth
          value={transactionData.appliedDate}
          onChange={handleInputChange}
          name="appliedDate"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.appliedDate}
          helperText={errors.appliedDate}
        />

        <FormControl fullWidth sx={{ margin: '0.5rem 0' }} error={!!errors.grantedBy}>
          <InputLabel>Granted By</InputLabel>
          <Select
            value={transactionData.grantedBy}
            onChange={handleInputChange}
            fullWidth
            name="grantedBy"
            label="Granted By"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 250,
                },
              },
            }}
          >
            {users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
          {errors.grantedBy && <FormHelperText>{errors.grantedBy}</FormHelperText>}
        </FormControl>

        <TextField
          margin="dense"
          label="Remarks"
          type="text"
          fullWidth
          value={transactionData.remarks}
          onChange={handleInputChange}
          name="remarks"
          error={!!errors.remarks}
          helperText={errors.remarks}
        />

        <TextField
          margin="dense"
          label="Application No."
          type="text"
          fullWidth
          value={transactionData.applicationNo}
          onChange={handleInputChange}
          name="applicationNo"
          error={!!errors.applicationNo}
          helperText={errors.applicationNo}
        />

        <Stack direction="row" spacing={2}>
          Is Own<Switch
            checked={transactionData.is_own}
            onChange={(e) => setTransactionData({ ...transactionData, is_own: e.target.checked })}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          Is Alloted<Switch
            checked={transactionData.is_alloted}
            onChange={(e) => setTransactionData({ ...transactionData, is_alloted: e.target.checked })}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={createTransaction}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

NewTransaction.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  companies: PropTypes.array.isRequired,
};