import { Helmet } from 'react-helmet-async';

import { IncomeView } from 'src/sections/income/view';


// ----------------------------------------------------------------------

export default function CompanyPage() {
  return (
    <>
      <Helmet>
        <title>Income statement |  </title>
      </Helmet>
      <IncomeView/>
    </>
  );
}
