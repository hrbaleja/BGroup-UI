import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import React, { useState, useEffect, } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import { Logout, SetCookies } from 'src/function/auth';
import authService from 'src/services/auth/authService';
const APP_URL = import.meta.env.VITE_APP_URL;

import { PATHS } from './routes';

const ProtectedRoute = ({ children }) => {
   const location = useLocation();
   const [isLoading, setIsLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      const checkTokens = async () => {
         setIsLoading(true);

         const accessToken = Cookies.get('accessToken');
         const refreshToken = Cookies.get('refreshToken');

         if (accessToken && refreshToken) {
            setIsAuthenticated(true);
         }
         else if (!accessToken && refreshToken) {
            try {
               const response = await authService.refreshtoken(refreshToken);
               const { accessToken: newaccessToken, newRefreshToken: newrefreshToken } = response;
               SetCookies(newaccessToken, newrefreshToken);
               setIsAuthenticated(true);
            } catch (error) {
               console.error("Error refreshing token:", error);
               Logout();
               setIsAuthenticated(false);
            }
         }
         else {
            setIsAuthenticated(false);
         }
         setIsLoading(false);
      };

      checkTokens();
   }, [location.pathname]);

   if (isLoading) {
      return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
         </Box>
      );
   }

   if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(location.pathname);
      window.location.href = `${APP_URL}${PATHS.LOGIN}?redirect=${redirectUrl}`;  
      return null;
   }

   return children;
};

// Define prop types
ProtectedRoute.propTypes = {
   children: PropTypes.node.isRequired,
};

export default ProtectedRoute;