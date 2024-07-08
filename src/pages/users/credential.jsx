import { Helmet } from 'react-helmet-async';

import { CredentialView } from 'src/sections/users/credential/view';

// ----------------------------------------------------------------------

export default function CredentialPage() {
    return (
        <>
            <Helmet>
                <title> Credentials Information  | </title>
            </Helmet>

            <CredentialView />
        </>
    );
}