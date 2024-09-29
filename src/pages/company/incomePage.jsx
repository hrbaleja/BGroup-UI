import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { IncomeView } from 'src/views/companies/income/view';

// ----------------------------------------------------------------------

export default function IncomePage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.INCOME}</title>
      </Helmet>

     <IncomeView/>
    </>
  );
}
