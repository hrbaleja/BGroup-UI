import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { UserView } from 'src/views/users/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title>{PAGE_TITLES.USERS}</title>
      </Helmet>
      
      <UserView />
    </>
  );
}