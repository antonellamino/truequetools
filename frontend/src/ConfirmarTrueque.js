import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './navbar';
import './ConfirmarTrueque.css'; // Importa el archivo de estilos
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ConfirmarTrueque = () => {
    const { id } = useParams();
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
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

            console.log('seteados', response.data);
        } catch (error) {
            console.error('Error al confirmar el trueque:', error);
            setError('Error al confirmar el trueque');
        }
    };

    const rechazar = async (idTrueque) => {
        console.log("trueque rechazado");
    };

    const registrarVenta = async () => {
        navigate('/altaVenta');
    };

    return (
        <div>
            <Navbar />
            <div className="trueques-pendientes-container">
                <div className="header">
                    <h2>Trueques Pendientes</h2>
                </div>
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
                                    {!trueque.confirmado && (
                                        <div>
                                            <button className="confirm-button" onClick={() => confirmar(trueque.id)}>Aceptar</button>
                                            <button className="decline-button" onClick={() => rechazar(trueque.id)}>Rechazar</button>
                                        </div>
                                    )}
                                    {trueque.confirmado && <p className="confirmation-message">Se ha aceptado el trueque correctamente</p>}
                                    {trueque.confirmado && <button onClick={() => registrarVenta()}>Registrar Venta</button>}
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