import { Helmet } from 'react-helmet-async';

import { FORGOTPWD } from 'src/constants/auth';

import { ForgotPasswordView } from 'src/sections/auth/forgotpassword';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
    return (
        <>
            <Helmet>
                <title> {FORGOTPWD} </title>
            </Helmet>
            <ForgotPasswordView />

        </>
    );
}
