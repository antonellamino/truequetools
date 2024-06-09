import React, { Fragment } from 'react';
import Navbar from './navbar';
import { useNavigate } from 'react-router-dom';

const EmpleadoDashboard = () => {
    const navigate = useNavigate();

    const handleCerrarSesion = () => {
        localStorage.removeItem('token');
        navigate('/logout');
    }

    return (
        <Fragment>
        <Navbar />
        <div className="container-4 mt">
            <div className="card">
                <div className="card-body">
                    <div className="d-grid gap-2">
                        <button className="btn btn-primary mb-2" >Registrar ventaenta</button>
                        <button className="btn btn-primary mb-2" >Lista de trueques pendientes</button>
                        <button className="btn btn-primary mb-2" >Ventas registradas</button>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>


    )
}

export default EmpleadoDashboard;