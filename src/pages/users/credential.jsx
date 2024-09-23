import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';

import { CredentialView } from 'src/sections/users/credential/view';

// ----------------------------------------------------------------------

export default function CredentialPage() {
    return (
        <>
            <Helmet>
                <title>{PAGE_TITLES.CREDENTIALS}</title>
            </Helmet>

            <CredentialView />
        </>
    );
}