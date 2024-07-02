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
            <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
                <Container fluid className="p-3 flex-grow-1">
                    <Row xs={1} md={2} lg={3} className="g-4">
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Trueques pendientes por sucursal</Card.Title>
                                    <Button variant="primary" onClick={handleTruequesPendientes}>Trueques Pendientes</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4">
                            <Card className="h-100 border border-primary border-2 d-flex flex-column justify-content-center">
                                <Card.Body className="text-center">
                                    <Card.Title>Ventas registradas</Card.Title>
                                    <Button variant="primary" onClick={handleVentasRegistradas}>Ventas Registradas</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        </Fragment>
    );
}

export default EmpleadoDashboard;
