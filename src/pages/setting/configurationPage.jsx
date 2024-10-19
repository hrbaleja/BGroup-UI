import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { ConfigurationView } from 'src/views/setting/configuration';

// ----------------------------------------------------------------------

export default function AppPage() {

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.CONFIGURATION}</title>
      </Helmet>
      
      <ConfigurationView/>
    </>
  );
}
