import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { ContactView } from 'src/views/users/contact/view';

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.CONTACTS} </title>
      </Helmet>

      <ContactView />
    </>
  );
}