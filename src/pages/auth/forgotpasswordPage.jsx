import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { ForgotPasswordView } from 'src/views/auth/forgotpassword';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
    return (
        <>
            <Helmet>
                <title>{PAGE_TITLES.FORGOTPWD}</title>
            </Helmet>

            <ForgotPasswordView />
        </>
    );
}
