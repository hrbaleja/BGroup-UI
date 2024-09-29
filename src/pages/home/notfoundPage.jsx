import { Helmet } from 'react-helmet-async';

import { NotFoundView } from 'src/views/error';
import { PAGE_TITLES } from 'src/constants/page';

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
