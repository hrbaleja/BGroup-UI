import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import { AccountView } from 'src/sections/bank/account/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.ACCOUNT}  </title>
      </Helmet>

      <AccountView />
    </>
  );
}
