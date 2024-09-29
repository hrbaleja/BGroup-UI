import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/views/Home/view';
import { PAGE_TITLES } from 'src/constants/page';

// ----------------------------------------------------------------------

export default function HomePage() {

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.HOME}</title>
      </Helmet>

      <HomeView/>
    </>
  );
}
