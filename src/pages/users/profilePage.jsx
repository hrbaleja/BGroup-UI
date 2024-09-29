import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { ProfileView } from 'src/views/users/profile/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> {PAGE_TITLES.PROFILE} </title>
      </Helmet>

      <ProfileView />
    </>
  );
}