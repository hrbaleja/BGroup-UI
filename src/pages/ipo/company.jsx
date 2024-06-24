import { Helmet } from 'react-helmet-async';

import { CompanyView } from 'src/sections/company/view';


// ----------------------------------------------------------------------

export default function CompanyPage() {
  return (
    <>
      <Helmet>
        <title>Companies |  </title>
      </Helmet>
      <CompanyView/>
    </>
  );
}
