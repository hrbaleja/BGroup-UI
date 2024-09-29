import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { IncomeView } from 'src/views/others/income/view';

// ----------------------------------------------------------------------

export default function IncomePage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.OTHER_INCOME} </title>
      </Helmet>
      
     <IncomeView/>
    </>
  );
}
