import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACK_URL;

const ConfirmarTrueque = () => {
    const { id } = useParams();
    const [trueques, setTrueques] = useState([]);
    const [error, setError] = useState(null);
    const [truequeAceptado, setTruequeAceptado] = useState(false); // Nuevo estado

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

            // Actualiza el estado para marcar el trueque como confirmado y mostrar el mensaje
            setTruequeAceptado(true);
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

    return (
        <div>
            <h2>Trueques</h2>
            {error && <p>{error}</p>}
            {trueques.length > 0 ? (
                <ul>
                    {trueques.map(trueque => (
                        <li key={trueque.id}>
                            <p>Fecha: {new Date(trueque.fecha).toLocaleDateString()}</p>
                            <p>Propietario: {trueque.propietario.nombre}</p> {/* Muestra el nombre del propietario */}
                            <p>Ofertante: {trueque.ofertante.nombre}</p> {/* Muestra el nombre del ofertante */}
                            <img src={trueque.productoPropietario.imagen_1 ? `data:image/jpeg;base64,${trueque.productoPropietario.imagen_1}` : './logo_2.svg'} alt="Producto Propietario" />
                            <img src={trueque.productoOfertante.imagen_1 ? `data:image/jpeg;base64,${trueque.productoOfertante.imagen_1}` : './logo_2.svg'} alt="Producto Ofertante" />
                            {!trueque.confirmado && (
                                <button onClick={() => confirmar(trueque.id)}>Confirmar</button>
                            )}
                            {trueque.confirmado && <p>Se ha aceptado el trueque correctamente</p>} {/* Mostrar mensaje si el trueque está confirmado */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay trueques disponibles.</p>
            )}
        </div>
    );
};

export default ConfirmarTrueque;