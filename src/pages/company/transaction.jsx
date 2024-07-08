import { Helmet } from 'react-helmet-async';

import { TransactionView } from 'src/sections/companies/transaction/view';


// ----------------------------------------------------------------------

export default function TransactionPage() {
  return (
    <>
      <Helmet>
        <title>Companies Transaction |  </title>
      </Helmet>
      <TransactionView />
    </>
  );
}
