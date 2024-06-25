import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './navbar';

const AdminDashboard = () => {
    const { isAuthenticated, rol } = useAuth();
    const navigate = useNavigate();

    const handleAltaEmpleado = () => {
        navigate('/altaEmpleado');
    };

    const handleListaEmpleados = () => {
        navigate('/listaEmpleados');
    };

    const handleAltaSucursal = () => {
        navigate('/formularioSucursal');
    };

    const handleVentas = () => {
        navigate('/ventas');
    };

    const handleTruequesExitosos = () => {
        navigate('/truequesExitosos');
    };

    const handlePromedio = () => {
        //navigate();
        console.log("falta implementar jiji");
    };

    

    return (
        <Fragment>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary mb-3" onClick={handleAltaEmpleado}>Dar de alta empleado</button>
                                    <button className="btn btn-primary mb-3" onClick={handleListaEmpleados}>Lista empleados</button>
                                    <button className="btn btn-primary mb-3" onClick={handleVentas}>Ventas registradas</button>
                                    <button className="btn btn-primary mb-3" onClick={handlePromedio}>Promedio de ventas por sucursal</button>
                                    <button className="btn btn-primary mb-3" onClick={handleTruequesExitosos}>Trueques exitosos por sucursal</button>
                                    <button className="btn btn-primary mb-3" onClick={handleAltaSucursal}>Dar de alta sucursal</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

    );
}

export default AdminDashboard;