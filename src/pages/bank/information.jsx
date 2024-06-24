import { Helmet } from 'react-helmet-async';

import { InformationView } from 'src/sections/information/view';

// ----------------------------------------------------------------------

export default function InformationPage() {
  return (
    <>
      <Helmet>
        <title> Information |  </title>
      </Helmet>

      <InformationView />
    </>
  );
}
