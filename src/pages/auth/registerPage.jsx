import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { RegisterView } from 'src/views/auth/register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.REGISTER} </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
