// src/protected/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component: Component, adminOnly, ...rest }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user.rolID !== 2) {
        return <Navigate to="/products" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
