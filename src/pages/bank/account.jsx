import { Helmet } from 'react-helmet-async';

import { AccountView } from 'src/sections/bank/account/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  return (
    <>
      <Helmet>
        <title> Bank Account |  </title>
      </Helmet>

      <AccountView />
    </>
  );
}
