import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import AppErrorLogs from 'src/sections/setting/errorlog-view';

// ----------------------------------------------------------------------

export default function AppPage() {

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.ERRORLOG}</title>
      </Helmet>
      <AppErrorLogs/>
    </>
  );
}
