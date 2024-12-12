import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/views/Home/view';

const APPNAME = import.meta.env.VITE_APP_NAME;

// ----------------------------------------------------------------------

export default function HomePage() {

  return (
    <>
      <Helmet>
        <title>{APPNAME}</title>
      </Helmet>

      <HomeView/>
    </>
  );
}
