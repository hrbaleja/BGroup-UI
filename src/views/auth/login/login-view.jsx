import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { PATHS } from 'src/routes/routes';
import { useRouter } from 'src/routes/hooks';

import { validateEmail } from 'src/utils/validation';

import { SetCookies } from 'src/function/auth';
import { PAGE_TITLES } from 'src/constants/page';
import { VALIDATION_MESSAGES } from 'src/validation';
import {APIMESSAGES,  } from 'src/constants/messages';
import authService from 'src/services/auth/authService';
import { useNotification } from 'src/context/NotificationContext';

import Iconify from 'src/components/iconify';

import { AuthView } from '../view';


const LoginView = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const { showNotification } = useNotification();

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   if (searchParams.size > 0) {
  //     // setErrors(APIMESSAGES.TOKEN_ERR);
  //   }

  // }, []);
  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors('');

    try {
      const uemail = event.target.email.value;
      const password = event.target.password.value;

      if (!validateEmail(uemail)) {
        setErrors(VALIDATION_MESSAGES.EMAIL_VALIDATE);
        return;
      }

      if (!password) {
        setErrors(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
        return;
      }

      setIsLoading(true);
      const response = await authService.login(uemail, password);
      const { accessToken, refreshToken } = response;
      SetCookies(accessToken, refreshToken);
      const searchParams = new URLSearchParams(window.location.search);
      const redirectPath = searchParams.get('redirect') || PATHS.DASHBOARD;
      router.push(redirectPath);
      showNotification(APIMESSAGES.LOGIN_SUCCESS, {
        severity: 'success',
      });
    } catch (error) {
      showNotification(error.response?.data?.message || APIMESSAGES.LOGIN_ERR, {
        severity: 'error',
      });
      setErrors(error.response?.data?.message || APIMESSAGES.LOGIN_ERR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (
    <form onSubmit={handleLogin}>
      <Stack spacing={3}>
        <TextField name="email" label="Email Address" required autoComplete="email"
        />
        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
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
      </Stack>

      {errors && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {errors}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link to={PATHS.FORGOT_PASSWORD} variant="subtitle2" style={{ textDecoration: 'none', color: 'inherit' }}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isLoading}
      >
        {PAGE_TITLES.LOGIN}
      </LoadingButton>
    </form>
  );

  return (
    <AuthView
      title={PAGE_TITLES.LOGIN}
      linkText="Don't have an account?"
      linkUrl={PATHS.REGISTER}
    >
      {renderForm}
    </AuthView>
  );
};

export default LoginView;