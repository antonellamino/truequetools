import React, { Fragment } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const ClienteDashboard = () => {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        navigate('/logout');
    }


    return(
        <Fragment>
            <Navbar />
            <button type="button" className="btn btn-info" onClick={handleCerrarSesion}>Cerrar sesion</button>
        </Fragment>
    )
}

export default ClienteDashboard;