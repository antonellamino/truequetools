// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from './AuthContext';

// const ProtectedRoute = ({ children, requiredRole }) => {
//     const { isAuthenticated, rol } = useAuth();

//     if (!isAuthenticated) {
//         alert('Debes iniciar sesion para acceder a esta ruta')
//         return <Navigate to="/iniciarSesionEmpleado" />;
//     }

//     if (rol !== requiredRole) {
//         alert('Debes iniciar sesion para acceder a esta pagina');
//         return <Navigate to="/iniciarSesionEmpleado" />;
//     }
    

//     return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, rol } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        alert('Debes iniciar sesión para acceder a esta ruta');
        return <Navigate to="/iniciarSesionEmpleado" state={{ from: location }} />;
    }

    if (!allowedRoles.includes(rol.toString())) {
        alert('No tienes permisos para acceder a esta página');
        return <Navigate to="/403" />;
    }

    return children;
};

export default ProtectedRoute;


