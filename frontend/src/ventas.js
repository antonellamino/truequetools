import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Navbar from './navbar';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Ventas = () => {
    const { isAuthenticated } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`${backendUrl}/ventas`)
                .then(response => {
                    // Formatear la fecha de cada venta
                    const ventasFormateadas = response.data.ventas.map(venta => {
                        return { ...venta, fecha_venta: venta.fecha_venta.slice(0, 10) };
                    });
                    setVentas(ventasFormateadas);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error al obtener las ventas:', error);
                    setLoading(false);
                });
        }
    }, [isAuthenticated]);



    if (!isAuthenticated) {
        return <p>No tienes permiso para ver esta página. Por favor, inicia sesión.</p>;
    }


    return (
        <Fragment>
            <Navbar />
            <div className="container">
                {loading ? (
                    <p>Cargando ventas...</p>
                ) : (
                    <div>
                        <h2 className="text-white">Ventas</h2>
                        {ventas.length > 0 ? (
                            <table className="table table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Articulo</th>
                                        <th>Fecha de venta</th>
                                        <th>Precio</th>
                                        <th>Email usuario comprador</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.map((venta, index) => (
                                        <tr key={index}>
                                            <td>{venta.articulo}</td>
                                            <td>{venta.fecha_venta}</td>
                                            <td>{venta.valor}</td>
                                            <td>{venta.email_usuario}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay ventas disponibles.</p>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
};

export default Ventas;
