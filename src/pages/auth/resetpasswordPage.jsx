import { Helmet } from 'react-helmet-async';

import { PAGE_TITLES } from 'src/constants/page';
import { ResetPasswordView } from 'src/views/auth/resetpassword';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
    return (
        <>
            <Helmet>
                <title>{PAGE_TITLES.RESETPWD}</title>
            </Helmet>

            <ResetPasswordView />
        </>
    );
}
