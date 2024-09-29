import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { CompanyView } from 'src/views/companies/company/view';

// ----------------------------------------------------------------------

export default function CompanyPage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.COMPANY}</title>
      </Helmet>

      <CompanyView/>
    </>
  );
}
