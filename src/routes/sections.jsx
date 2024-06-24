import Cookies from 'js-cookie';
import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import ProtectedRoute from './ProtectedRoute';

export const LoginPage = lazy(() => import('src/pages/auth/login'));
export const IndexPage = lazy(() => import('src/pages/overview/app'));
export const Page404 = lazy(() => import('src/pages/overview/page-not-found'));
export const RegisterPage = lazy(() => import('src/pages/auth/register'));
export const MoneyPage = lazy(() => import('src/pages/bank/money'));
export const InformationPage = lazy(() => import('src/pages/bank/information'));
export const CompanyPage = lazy(() => import('src/pages/ipo/company'))
export const TransactionPage = lazy(() => import('src/pages/ipo/transaction'));
export const IncomePage = lazy(() => import('src/pages/ipo/income'))
export const ProfilePage = lazy(() => import('src/pages/users/profile'))
export const UserPage = lazy(() => import('src/pages/users/user'));
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
          path: 'bank',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MoneyPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'information',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InformationPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'information',
          element: (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InformationPage />
            </ProtectedRoute>
          ),
        },
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