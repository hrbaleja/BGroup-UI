import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.INDEX}</title>
      </Helmet>

      <AppView />
    </>
  );
}
