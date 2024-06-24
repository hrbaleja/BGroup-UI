import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
 const location = useLocation();

 if (!isAuthenticated) {
    // Redirect to login page or show a message
    return <Navigate to="/login" state={{ from: location }} replace />;
 }

 return children;
};

// Define prop types
ProtectedRoute.propTypes = {
 children: PropTypes.node.isRequired,
 isAuthenticated: PropTypes.bool.isRequired,
};

export default ProtectedRoute;
