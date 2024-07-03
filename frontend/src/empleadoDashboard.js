import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const EmpleadoDashboard = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const rol = localStorage.getItem('rol');

    useEffect(() => {
        console.log(!isAuthenticated, rol);
        if (!isAuthenticated || rol !== '2') {
            navigate('/403');
        }
    }, [isAuthenticated, rol, navigate]);

    const handleTruequesPendientes = () => {
        navigate('/listaSucursales');
    };

    const handleVentasRegistradas = () => {
        navigate('/ventas');
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
                                <button className="btn btn-primary mb-3" onClick={handleTruequesPendientes}>Trueques pendientes por sucursal</button>
                                <button className="btn btn-primary mb-3" onClick={handleVentasRegistradas}>Ventas registradas</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
    );
}

export default EmpleadoDashboard;
