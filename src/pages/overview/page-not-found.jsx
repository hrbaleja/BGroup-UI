import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.ERROR} </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
