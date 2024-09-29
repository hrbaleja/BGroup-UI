import React, { useState, } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { PATHS } from 'src/routes/routes';

import { validateEmail } from 'src/utils/validation';

import { VALIDATION_MESSAGES } from 'src/validation';
import authService from 'src/services/auth/authService';
import {FORGOTPWD, API_MESSAGES,  } from 'src/constants/auth';

import { AuthView } from '../view';

const ForgotPasswordView = () => {

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError(VALIDATION_MESSAGES.EMAIL_REQUIRED);
      return;
    }
  
    if (!validateEmail(email)) {
      setError(VALIDATION_MESSAGES.EMAIL_VALIDATE);
      return;
    }
  
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
  
      await authService.forgotPassword(email);
      setSuccess(API_MESSAGES.FORGOTPWD_SUCCESS);
    } 
    catch (error) {
      setError(error.response?.data?.message || API_MESSAGES.FORGOTPWD_ERR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (
    <>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {`Enter your email address and we'll send you instructions to reset your password.`}
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {errors && (
          <Typography variant="body2" color="error">
            {errors}
          </Typography>
        )}

        {success && (
          <Typography variant="body2" color="success.main">
            {success}
          </Typography>
        )}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          onClick={handleForgotPassword}
        >
          Send Reset Link
        </LoadingButton>
      </Stack>

    </>
  );

  return (
    <AuthView
      title={FORGOTPWD}
      linkText="Remember your password?"
      linkUrl={PATHS.LOGIN}
    >
      {renderForm}
    </AuthView>
  );
};

export default ForgotPasswordView;