import { Helmet } from 'react-helmet-async';

import { IncomeView } from 'src/sections/companies/income/view';


// ----------------------------------------------------------------------

export default function IncomePage() {
  return (
    <>
      <Helmet>
        <title>Companies Income  |  </title>
      </Helmet>
     <IncomeView/>
    </>
  );
}
