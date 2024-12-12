import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/views/overview/view';

const APPNAME = import.meta.env.VITE_APP_NAME;

// ----------------------------------------------------------------------

export default function AppPage() {

  return (
    <>
      <Helmet>
        <title>{APPNAME}</title>
      </Helmet>

      <AppView />
    </>
  );
}
