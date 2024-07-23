import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { validateEmail } from 'src/utils/validation';

import { SetCookies } from 'src/function/auth';
import { VALIDATION_MESSAGES } from 'src/validation';
import authService from 'src/services/auth/authService';
import { LOGIN, API_MESSAGES } from 'src/constants/auth';

import Iconify from 'src/components/iconify';

import { AuthView } from '../view';


const LoginView = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');

  // useEffect(() => {
  //   const searchParams = new URLSearchParams(window.location.search);
  //   if (searchParams.size > 0) {
  //     // setErrors(API_MESSAGES.TOKEN_ERR);
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
      const redirectPath = searchParams.get('redirect') || '/';
      router.push(redirectPath);
    } catch (error) {
      console.log(error.response.data.message)
      setErrors(error.response?.data?.message || API_MESSAGES.LOGIN_ERR);
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = (
    <form onSubmit={handleLogin}>
      <Stack spacing={3}>
        <TextField name="email" label="Email Address" required />
        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
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
        <Link to="/forgotpassword" variant="subtitle2" style={{ textDecoration: 'none', color: 'inherit' }}>
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
        {LOGIN}
      </LoadingButton>
    </form>
  );

  return (
    <AuthView
      title={LOGIN}
      linkText="Don't have an account?"
      linkUrl="/register"
    >
      {renderForm}
    </AuthView>
  );
};

export default LoginView;