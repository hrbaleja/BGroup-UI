import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/transactionI/view';

// ----------------------------------------------------------------------

export default function MoneyPage() {
  return (
    <>
      <Helmet>
        <title> Transaction |  </title>
      </Helmet>

      <TransactionView />
    </>
  );
}
