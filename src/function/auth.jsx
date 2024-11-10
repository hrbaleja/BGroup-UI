import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


export function Logout() {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('email');
    Cookies.remove('username');
    Cookies.remove('role');
    Cookies.remove('lastLoginTime');
}

export function SetCookies(accessToken, refreshToken) {

    const decodedRFToken = jwtDecode(refreshToken);
    const { exp: exprf } = decodedRFToken
    const expirationRFTime = new Date(exprf * 1000);
    Cookies.set('refreshToken', refreshToken, { expires: expirationRFTime });

    const decodedToken = jwtDecode(accessToken);
    const { email, username, role, lastLoginTime, exp } = decodedToken;
    const expirationTime = new Date(exp * 1000);
    Cookies.set('accessToken', accessToken, { expires: expirationTime });
    Cookies.set('email', email, { expires: expirationTime });
    Cookies.set('username', username, { expires: expirationTime });
    Cookies.set('role', role, { expires: expirationTime });
    Cookies.set('lastLoginTime', lastLoginTime, { expires: expirationTime });
}