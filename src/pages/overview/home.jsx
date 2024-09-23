import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import { HomeView } from 'src/sections/Home/view';


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
