import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { TransactionView } from 'src/views/companies/transaction/view';

// ----------------------------------------------------------------------

export default function TransactionPage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.TRANSACTIONS}  </title>
      </Helmet>

      <TransactionView />
    </>
  );
}
