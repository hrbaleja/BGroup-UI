import { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { PATHS } from 'src/routes/routes';
import { useRouter } from 'src/routes/hooks';

import { validateName, validateEmail, validatePassword, } from 'src/utils/validation';

import { VALIDATION_MESSAGES } from 'src/validation';
import authService from 'src/services/auth/authService';
import { REGISTER, API_MESSAGES } from 'src/constants/auth';

import Iconify from 'src/components/iconify';

import { AuthView } from '../view';

// ----------------------------------------------------------------------

export default function RegisterView() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setError] = useState('');

  const handleClick = async () => {
    setError('');

    try {
      const username = document.querySelector('input[name="name"]').value;
      const useremail = document.querySelector('input[name="email"]').value;
      const userpassword = document.querySelector('input[name="password"]').value;
      const userconfirmPassword = document.querySelector('input[name="confirmPassword"]').value;

      if (!validateName(username)) {
        setError(VALIDATION_MESSAGES.NAME_VALIDATE);
        return;
      }

      if (!validateEmail(useremail)) {
        setError(VALIDATION_MESSAGES.EMAIL_VALIDATE)
        return;
      }

      if (!validatePassword(userpassword)) {
        setError(VALIDATION_MESSAGES.PASSWORD_VALIDATE)
        return;
      }

      if (userpassword !== userconfirmPassword) {
        setError(VALIDATION_MESSAGES.PASSWORD_MATCH);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const userData = {
        name: username,
        email: useremail,
        password: userpassword,
      };
      const response = await authService.register(userData);
      if (response.status === 201) {
        alert(API_MESSAGES.REGISTER_SUCCESS);
        router.push(PATHS.LOGIN);
      }
      else {
        setError(response.response.data?.message || API_MESSAGES.REGISTER_ERR);
      }
    }
    catch (response) {
      setError(response.response.data?.message || API_MESSAGES.REGISTER_ERR);
    }
    finally {
      setIsLoading(false);
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Full Name" required />

        <TextField name="email" label="Email address" required />

        <TextField
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
          required
        />

        <TextField
          name="confirmPassword"
          label="Confirm Password"
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
          required
        />

      </Stack>

      {errors && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {errors}
        </Typography>
      )}

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={isLoading}
        sx={{ my: 3 }}
      >
        {REGISTER}
      </LoadingButton>
    </>
  );

  return (
    <AuthView
      title={REGISTER}
      linkText="Already have an account?"
      linkUrl="/login"
    >
      {renderForm}
    </AuthView>
  );
}