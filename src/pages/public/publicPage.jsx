import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { PublicAccountView } from 'src/views/public/account';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.ACCOUNT}</title>
      </Helmet>

      < PublicAccountView/>
    </>
  );
}
