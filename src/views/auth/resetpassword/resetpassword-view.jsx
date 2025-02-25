import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useParams, useNavigate } from 'react-router-dom';

import { PATHS } from 'src/routes/routes';
import { validatePassword } from 'src/utils/validation';

import { PAGE_TITLES } from 'src/constants/page';
import { VALIDATION_MESSAGES } from 'src/validation';
import { APIMESSAGES } from 'src/constants/messages';
import authService from 'src/services/auth/authService';

import { AuthView } from '../view';

const ResetPasswordView = () => {
  const { token } = useParams(); 
  console.log(token)
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      setError(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
      return;
    }

    if (!validatePassword(password)) {
      setError(VALIDATION_MESSAGES.PASSWORD_VALIDATE);
      return;
    }

    if (password !== confirmPassword) {
      setError(VALIDATION_MESSAGES.PASSWORD_MATCH);
      return;
    }
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      const userData = {
        authtoken: token,
        newPassword: password,
      };
      // Call the reset password API with token and new password
      await authService.resetPassword(userData);
      setSuccess(APIMESSAGES.PWD_RESET_SUCCESS);
      // Redirect to login after success
      setTimeout(() => navigate(PATHS.LOGIN), 3000);
    } catch (error) {
      setError(error.response?.data?.message || APIMESSAGES.PWD_RESET_ERR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (
    <>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {`Enter your new password below.`}
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          name="password"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          onClick={handleResetPassword}
        >
          Reset Password
        </LoadingButton>
      </Stack>
    </>
  );

  return (
    <AuthView
      title={PAGE_TITLES.RESETPWD}
      linkText="Remember your password?"
      linkUrl={PATHS.LOGIN}
    >
      {renderForm}
    </AuthView>
  );
};

export default ResetPasswordView;
