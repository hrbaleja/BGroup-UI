import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import ProtectedRoute from './ProtectedRoute';

export const LoginPage = lazy(() => import('src/pages/auth/login'));
export const RegisterPage = lazy(() => import('src/pages/auth/register'));
export const ForgotPasswordPage =lazy(()=>import('src/pages/auth/forgotpassword'))

export const AccountPage = lazy(() => import('src/pages/bank/account'));

export const IndexPage = lazy(() => import('src/pages/overview/app'));
export const Page404 = lazy(() => import('src/pages/overview/page-not-found'));

export const UserPage = lazy(() => import('src/pages/users/user'));
export const CredentialPage = lazy(() => import('src/pages/users/credential'));
export const ProfilePage = lazy(() => import('src/pages/users/profile'))

export const CompanyPage = lazy(() => import('src/pages/company/company'))
export const TransactionPage = lazy(() => import('src/pages/company/transaction'));
export const IncomePage = lazy(() => import('src/pages/company/income'))

export const BlogPage = lazy(() => import('src/pages/blog'));
export const ProductsPage = lazy(() => import('src/pages/products'));

export const OtherIncome= lazy(()=>import('src/pages/others/income') )

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
          path: 'user',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'products',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'blog',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BlogPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'account',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AccountPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'credential',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CredentialPage />
            </ProtectedRoute>
          ),
        },
        // {
        //   path: 'information',
        //   element: (
        //     <ProtectedRoute isAuthenticated={isAuthenticated}>
        //       <InformationPage />
        //     </ProtectedRoute>
        //   ),
        // },
        {
          path: 'transaction',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TransactionPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'companies',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CompanyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'income',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <IncomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/others/income',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OtherIncome />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />,
    },
    {
      path: 'register',
      element: isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />,
    },
    {
      path: 'forgotpassword',
      element: isAuthenticated ? <Navigate to="/" replace /> : <ForgotPasswordPage />,
    },
    {
      path: '404',
      element: isAuthenticated ? <Page404 /> : <LoginPage />,
    },
    {
      path: '*',
      element: isAuthenticated ? <Navigate to="/404" replace /> : <LoginPage />,
    },
  ]);

  return routes;
}