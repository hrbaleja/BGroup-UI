import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { PATHS } from './routes';
import ProtectedRoute from './ProtectedRoute';

// Authentication Pages
export const LoginPage = lazy(() => import('src/pages/auth/loginPage'));
export const RegisterPage = lazy(() => import('src/pages/auth/registerPage'));
export const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgotpasswordPage'));

// Home Pages
export const DashboardPage = lazy(() => import('src/pages/home/appPage'));
export const IndexPage = lazy(() => import('src/pages/home/homePage'));

// User and Profile Pages
export const UserPage = lazy(() => import('src/pages/users/userPage'));
export const ProfilePage = lazy(() => import('src/pages/users/profilePage'));
export const CredentialPage = lazy(() => import('src/pages/users/credentialPage'));

// Company and Financial Pages
export const CompanyPage = lazy(() => import('src/pages/company/companyPage'));
export const TransactionPage = lazy(() => import('src/pages/company/transactionPage'));
export const IncomePage = lazy(() => import('src/pages/company/incomePage'));
export const OtherIncomePage = lazy(() => import('src/pages/others/incomePage'));

// Account Pages
export const AccountPage = lazy(() => import('src/pages/account/accountPage'));
export const AccountPageNew = lazy(() => import('src/pages/account/accountPageNew'));

// Settings Pages
export const ErrorLogsPage = lazy(() => import('src/pages/setting/errorlogPage'));
export const ConfigurationPage = lazy(() => import('src/pages/setting/configurationPage'));

// General Pages
export const Page404 = lazy(() => import('src/pages/home/notfoundPage'));

//
export const PublicPage = lazy(() => import('src/pages/public/publicPage'));

// Additional Content Pages
export const BlogPage = lazy(() => import('src/pages/blog'));
export const ProductsPage = lazy(() => import('src/pages/products'));

export default function Router() {
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');
  const isAuthenticated = !!accessToken && !!refreshToken;

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          path: PATHS.DASHBOARD,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          ),
          // index: true,
        },
        {
          path: PATHS.USER,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.PRODUCTS,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.BLOG,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BlogPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ACCOUNT,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.CREDENTIAL,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CredentialPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.TRANSACTION,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TransactionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.COMPANIES,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CompanyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.PROFILE,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.INCOME,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <IncomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.OTHER_INCOME,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OtherIncomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ERRORLOG,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorLogsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.CONFIGURATION,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ConfigurationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ACCOUNTNEW,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AccountPageNew />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: PATHS.LOGIN,
      element: isAuthenticated ? <Navigate to={PATHS.INDEX} replace /> : <LoginPage />,
    },
    {
      path: PATHS.REGISTER,
      element: isAuthenticated ? <Navigate to={PATHS.INDEX} replace /> : <RegisterPage />,
    },
    {
      path: PATHS.FORGOT_PASSWORD,
      element: isAuthenticated ? <Navigate to={PATHS.INDEX} replace /> : <ForgotPasswordPage />,
    },
    {
      path: PATHS.PAGE_404,
      element: isAuthenticated ? <Page404 /> : <LoginPage />,
    },
    {
      path: PATHS.ANY,
      element: isAuthenticated ? <Page404 /> : <LoginPage />,
    },
    {
      path: PATHS.INDEX,
      element: isAuthenticated ? <DashboardLayout /> : <IndexPage />,
    },
    {
      path: PATHS.CUSTOMER,
      element: <PublicPage />
    },
  ]);

  return routes;
}
