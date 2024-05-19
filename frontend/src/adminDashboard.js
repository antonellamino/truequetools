import React, { Fragment } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    //esto esta en el nav hace falta?
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        localStorage.removeItem('token'); // Esto asegurará que el token se elimina al cerrar sesión
        navigate('/logout');
    }

    return (
        <Fragment>
            <Navbar />
            <button onClick={handleCerrarSesion}>Cerrar Sesión</button>
            </Fragment>


    )
}

export default AdminDashboard;