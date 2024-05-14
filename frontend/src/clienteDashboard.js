import React, { Fragment, useEffect } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        navigate('/logout');
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Tenes que tener una sesion iniciada");
            navigate('/iniciarSesion');
        }
    }, [navigate]);

    return(
        <Fragment>
            <Navbar />
            <button type="button" className="btn btn-info" onClick={handleCerrarSesion}>Cerrar sesion</button>
        </Fragment>
    )
}

export default ClienteDashboard;