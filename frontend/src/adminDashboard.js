import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

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
        navigate('/promedioVentas');
    };



    return (
        <Fragment>
            <Navbar />
            <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
                <Container fluid className="p-3 flex-grow-1">
                    <Row xs={1} md={2} lg={3} className="g-4">
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Dar de alta empleado</Card.Title>
                                    <Button variant="primary" onClick={handleAltaEmpleado}>Alta Empleado</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center" >
                                <Card.Body className="text-center">
                                    <Card.Title>Dar de alta sucursal</Card.Title>
                                    <Button variant="primary" onClick={handleAltaSucursal}>Alta Sucursal</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Lista empleados</Card.Title>
                                    <Button variant="primary" onClick={handleListaEmpleados}>Lista Empleados</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Ventas registradas</Card.Title>
                                    <Button variant="primary" onClick={handleVentas}>Ventas Registradas</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Promedio de ventas por sucursal</Card.Title>
                                    <Button variant="primary" onClick={handlePromedio}>Promedio Ventas</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Trueques exitosos por sucursal</Card.Title>
                                    <Button variant="primary" onClick={handleTruequesExitosos}>Trueques Exitosos</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        </Fragment>
    );
};

export default AdminDashboard;