import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { LoginView } from 'src/views/auth/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.LOGIN} </title>
      </Helmet>

      <LoginView />
    </>
  );
}
