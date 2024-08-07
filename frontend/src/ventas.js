import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import Navbar from './Navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const Ventas = () => {
    const { isAuthenticated } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const rol = localStorage.getItem('rol');

    useEffect(() => {
        console.log(isAuthenticated, rol);
        if (!isAuthenticated || (rol !== '1' && rol !== '2')) {
            navigate('/403');
        }

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
                    setError('Error al obtener las ventas');
                    setLoading(false);
                });
        }
    }, [isAuthenticated, rol, navigate]);


    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post(`${backendUrl}/eliminar-venta`, { id: id });
                    setVentas(ventas.filter(venta => venta.id !== id));
                    Swal.fire(
                        'Eliminado!',
                        'La venta ha sido eliminada.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error al eliminar la venta:', error);
                    Swal.fire(
                        'Error!',
                        'Hubo un error al eliminar la venta.',
                        'error'
                    );
                }
            } else{
                Swal.fire({
                    title: 'Baja rechazada.',
                    icon: 'info',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    if (!isAuthenticated) {
        return <p>No tienes permiso para ver esta página. Por favor, inicia sesión.</p>;
    }

    return (
        <Fragment>
            <Navbar />
            <div className="container-fluid" style={{ minHeight: '100vh', paddingTop: 0 }}>
                {loading ? (
                    <p>Cargando ventas...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div>
                        <h2 className="text-white">Ventas</h2>
                        {ventas.length > 0 ? (
                            <table className="table table-striped w-100">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Articulo</th>
                                        <th>Fecha de venta</th>
                                        <th>Precio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.map((venta, index) => (
                                        <tr key={index}>
                                            <td>{venta.articulo}</td>
                                            <td>{venta.fecha_venta}</td>
                                            <td>{venta.valor}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(venta.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No hay ventas registradas.</p>
                        )}
                    </div>
                )}
            </div>
        </Fragment>
    );
    
};

export default Ventas;
