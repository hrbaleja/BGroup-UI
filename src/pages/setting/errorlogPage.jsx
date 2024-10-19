import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { AppErrorView } from 'src/views/setting/error';

// ----------------------------------------------------------------------

export default function AppPage() {

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.ERRORLOG}</title>
      </Helmet>
      
      <AppErrorView/>
    </>
  );
}
