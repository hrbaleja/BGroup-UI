import { Helmet } from 'react-helmet-async';

import { IncomeView } from 'src/sections/others/income/view';


// ----------------------------------------------------------------------

export default function IncomePage() {
  return (
    <>
      <Helmet>
        <title>Other Income  |  </title>
      </Helmet>
     <IncomeView/>
    </>
  );
}
