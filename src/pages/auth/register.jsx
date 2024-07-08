import { Helmet } from 'react-helmet-async';

import { REGISTER } from 'src/constants/auth';

import { RegisterView } from 'src/sections/auth/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> {REGISTER}  </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
