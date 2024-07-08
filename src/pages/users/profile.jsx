import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/users/profile/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> My Profile | </title>
      </Helmet>

      <ProfileView />
    </>
  );
}