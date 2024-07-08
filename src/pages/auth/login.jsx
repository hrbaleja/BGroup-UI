import { Helmet } from 'react-helmet-async';

import { LOGIN } from 'src/constants/auth';

import { LoginView } from 'src/sections/auth/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> {LOGIN} </title>
      </Helmet>

      <LoginView />
    </>
  );
}
