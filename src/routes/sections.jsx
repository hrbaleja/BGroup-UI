import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { PATHS } from './routes'; 
import ProtectedRoute from './ProtectedRoute';

export const LoginPage = lazy(() => import('src/pages/auth/login'));
export const RegisterPage = lazy(() => import('src/pages/auth/register'));
export const ForgotPasswordPage = lazy(() => import('src/pages/auth/forgotpassword'));

export const AccountPage = lazy(() => import('src/pages/bank/account'));

export const IndexPage = lazy(() => import('src/pages/overview/app'));
export const Page404 = lazy(() => import('src/pages/overview/page-not-found'));
export const HomePage = lazy(() => import('src/pages/overview/home'));

export const UserPage = lazy(() => import('src/pages/users/user'));
export const CredentialPage = lazy(() => import('src/pages/users/credential'));
export const ProfilePage = lazy(() => import('src/pages/users/profile'));

export const CompanyPage = lazy(() => import('src/pages/company/company'));
export const TransactionPage = lazy(() => import('src/pages/company/transaction'));
export const IncomePage = lazy(() => import('src/pages/company/income'));

export const BlogPage = lazy(() => import('src/pages/blog'));
export const ProductsPage = lazy(() => import('src/pages/products'));

export const OtherIncome = lazy(() => import('src/pages/others/income'));

export const ErrorLogs = lazy(() => import('src/pages/setting/errorlog'));

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
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <IndexPage />
            </ProtectedRoute>
          ),
          index: true,
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
              <OtherIncome />
            </ProtectedRoute>
          ),
        },
        {
          path: PATHS.ERRORLOG,
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ErrorLogs />
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
      element: isAuthenticated ? <Navigate to={PATHS.PAGE_404} replace /> : <LoginPage />,
    },
    {
      path: PATHS.Home,
      element:<HomePage/>
    },
  ]);

  return routes;
}
