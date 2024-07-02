import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './ConfirmarTrueque.css'; // Importa el archivo de estilos
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from './AuthContext';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ConfirmarTrueque = () => {
    const { id } = useParams();
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const rol = localStorage.getItem('rol');

    useEffect(() => {

        console.log(isAuthenticated, rol);
        if (!isAuthenticated || (rol !== '2')) {
            navigate('/403');
        }

        const fetchTrueques = async () => {
            try {
                const response = await axios.get(`${backendUrl}/trueques_Sucursal`, { params: { idSucursal: id } });
                setTrueques(response.data.trueques);
            } catch (error) {
                console.error('Error al obtener los trueques de la sucursal:', error);
                setError('Error al obtener los trueques de la sucursal');
            }
        };

        fetchTrueques();
    }, [id]);

    const confirmar = async (idTrueque) => {
        try {
            const response = await axios.post(`${backendUrl}/confirmar_trueque`, { idTrueque });
            console.log('Trueque confirmado:', response.data);

            // Actualizar el estado local para marcar el trueque como confirmado
            setTrueques(prevTrueques =>
                prevTrueques.map(trueque =>
                    trueque.id === idTrueque ? { ...trueque, confirmado: true } : trueque
                )
            );
        } catch (error) {
            console.error('Error al confirmar el trueque:', error);
            setError('Error al confirmar el trueque');
        }
    };

    const rechazar = async (idTrueque) => {
        // Mostrar alerta de confirmación
        const confirmacion = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción rechazará el trueque. ¿Estás seguro de continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        });
    
        // Si el usuario confirma la acción
        if (confirmacion.isConfirmed) {
            try {
                const response = await axios.post(`${backendUrl}/empleado_cancelar_trueque`, { idTrueque });
                console.log("trueque rechazado");
    
                setTrueques(prevTrueques =>
                    prevTrueques.map(trueque =>
                        trueque.id === idTrueque ? { ...trueque, rechazado: true } : trueque
                    )
                );
    
                // Mostrar alerta de éxito
                await Swal.fire({
                    title: 'Rechazado',
                    text: 'El trueque ha sido rechazado exitosamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
    
            } catch (error) {
                console.error('Error al rechazar el trueque:', error);
                setError('Error al rechazar el trueque');
    
                // Mostrar alerta de error
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al rechazar el trueque. Por favor, inténtalo nuevamente.',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            // Mostrar mensaje de que el trueque no ha sido rechazado
            await Swal.fire({
                title: 'Cancelado',
                text: 'El trueque no ha sido rechazado.',
                icon: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
        }
    };    

    const registrarVenta = async (id) => {
        navigate(`/altaVenta/${id}`);
    };

    const volver = () => {
        navigate('/listaSucursales');
    };

    return (
        <div>
            <Navbar />
            <div className="trueques-pendientes-container">
                <div className="header">
                    <h2>Trueques Pendientes</h2>
                </div>

                <button className="btn btn-primary mb-3" onClick={volver}>Volver</button>
                {error && <p className="error">{error}</p>}
                {trueques.length > 0 ? (
                    <ul className="trueques-list">
                        {trueques.map(trueque => (
                            <li key={trueque.id} className="trueque-item">
                                <div className="trueque-header">
                                    <p>Trueque entre {trueque.propietario.nombre} y {trueque.ofertante.nombre}</p>
                                </div>
                                <div className="trueque-images">
                                    <img
                                        src={trueque.productoPropietario.imagen_1 ? `data:image/jpeg;base64,${trueque.productoPropietario.imagen_1}` : '/logo_2.svg'}
                                        alt="Producto Propietario"
                                        className="trueque-image"
                                    />
                                    <img src="/Flecha_008.png" alt="Intercambio" className="trueque-flecha" />
                                    <img
                                        src={trueque.productoOfertante.imagen_1 ? `data:image/jpeg;base64,${trueque.productoOfertante.imagen_1}` : '/logo_2.svg'}
                                        alt="Producto Ofertante"
                                        className="trueque-image"
                                    />
                                </div>
                                <div className="trueque-actions">
                                    {!trueque.confirmado && !trueque.rechazado && (
                                        <div>
                                            <button className="confirm-button" onClick={() => confirmar(trueque.id)}>Aceptar</button>
                                            <button className="decline-button" onClick={() => rechazar(trueque.id)}>Rechazar</button>
                                        </div>
                                    )}
                                    {trueque.confirmado && <p className="confirmation-message">Se ha aceptado el trueque correctamente</p>}
                                    {trueque.rechazado && <p className="confirmation-message">Se ha rechazado el trueque correctamente</p>}
                                    {trueque.confirmado && <button className="btn btn-primary" onClick={() => registrarVenta(trueque.id)}>Registrar Venta</button>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay trueques disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default ConfirmarTrueque;
