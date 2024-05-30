import React, { Fragment, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Navbar from './navbar';

const AdminDashboard = () => {
    const { isAuthenticated, rol } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || rol !== 1) {
            navigate('/home');
        }
    }, [isAuthenticated, rol, navigate]);

    const handleCerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/logout');
    }

    return (
        <Fragment>
            <Navbar />
            <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
        </Fragment>
    );
}

export default AdminDashboard;