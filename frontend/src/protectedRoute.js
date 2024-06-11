import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, rol } = useAuth();

    if (!isAuthenticated) {
        alert('Debes iniciar sesion para acceder a esta ruta')
        return <Navigate to="/iniciarSesionEmpleado" />;
    }

    if (rol !== requiredRole) {
        alert('Debes iniciar sesion para acceder a esta pagina');
        return <Navigate to="/iniciarSesionEmpleado" />;
    }
    

    return children;
};

export default ProtectedRoute;
