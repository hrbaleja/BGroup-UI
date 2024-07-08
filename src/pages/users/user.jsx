import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/users/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | </title>
      </Helmet>
      <UserView />
    </>
  );
}