import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Dialog, Button, TextField, DialogTitle, DialogContent, DialogActions, InputAdornment, IconButton, Typography } from '@mui/material';
import { validateName, validateEmail, validatePassword } from 'src/utils/validation';
import { APIMESSAGES } from 'src/constants/messages';
import authService from 'src/services/auth/authService';
import { useNotification } from 'src/context/NotificationContext';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

export default function NewUser({ open, onClose, onSubmit }) {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [entryData, setEntryData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setEntryData({ ...entryData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    setErrors({});
    const { name, email, password, confirmPassword } = entryData;
    
    // Validate fields
    if (!validateName(name)) {
      setErrors(prev => ({ ...prev, name: 'Please enter a valid name' }));
      return;
    }
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    if (!validatePassword(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
      return;
    }
    if (password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    onSubmit(entryData); 
    setEntryData({ name: '', email: '', password: '', confirmPassword: '' });
    onClose(); 
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Full Name"
          value={entryData.name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          name="email"
          label="Email Address"
          value={entryData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.email)}
          helperText={errors.email}
        />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={entryData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          value={entryData.confirmPassword}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      {Object.keys(errors).length > 0 && (
        <Typography variant="body2" color="error" sx={{ mt: 1, ml: 2 }}>
          Please fix the errors above
        </Typography>
      )}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="outlined" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NewUser.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
