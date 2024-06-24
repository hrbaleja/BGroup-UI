import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/transaction/view';

// ----------------------------------------------------------------------

export default function MoneyPage() {
  return (
    <>
      <Helmet>
        <title> Money |  </title>
      </Helmet>

      <TransactionView />
    </>
  );
}
